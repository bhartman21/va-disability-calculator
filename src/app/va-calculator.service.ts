import { Injectable, signal, computed } from '@angular/core';
import { Disability, CalculationResult, CalculationStep, Extremity, ReferenceInfo } from './models';

@Injectable({
  providedIn: 'root'
})
export class VaCalculatorService {

  // Global State
  disabilities = signal<Disability[]>([]);
  showWholePersonChart = signal(true);
  selectedReference = signal<ReferenceInfo | null>(null);
  theme = signal<string>('army');
  showThemePicker = signal<boolean>(false);

  references: Record<string, ReferenceInfo> = {
    '4.25': {
      title: '38 CFR § 4.25 - Combined Ratings',
      description: 'Known as "VA Math" or the "Whole Person Theory," this regulation dictates how multiple disability ratings are merged. Ratings are not added together but applied sequentially to the "efficient" part of the person remaining after previous disabilities are accounted for.',
      sourceUrl: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.25'
    },
    '4.26': {
      title: '38 CFR § 4.26 - Bilateral Factor',
      description: 'When a veteran has disabilities affecting both upper extremities or both lower extremities, a 10% "bonus" is added to the combined rating of those specific conditions before they are combined with any other non-bilateral ratings.',
      sourceUrl: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.26'
    },
    '4.68': {
      title: '38 CFR § 4.68 - Amputation Rule',
      description: 'This rule ensures that the combined rating for multiple disabilities of a single extremity (arm or leg) cannot exceed the rating prescribed for the amputation of that same extremity.',
      sourceUrl: 'https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.68'
    }
  };

  // Computed State
  result = computed(() => {
    return this.calculate(this.disabilities());
  });

  // Actions
  addDisability(name: string, rating: number, extremity: Extremity, diagnosticCode?: string) {
    const newDisability: Disability = {
      id: crypto.randomUUID(),
      name: name.trim(),
      rating,
      extremity,
      diagnosticCode: diagnosticCode?.trim() || undefined
    };
    this.disabilities.update(list => [...list, newDisability]);
  }

  updateDisability(updated: Disability) {
    this.disabilities.update(list => list.map(item => {
      if (item.id === updated.id) {
        const changed = 
          item.name !== updated.name || 
          item.rating !== updated.rating || 
          item.extremity !== updated.extremity ||
          item.diagnosticCode !== updated.diagnosticCode ||
          item.secondaryDiagnosticCode !== updated.secondaryDiagnosticCode;
        return { ...updated, isModified: changed || item.isModified };
      }
      return item;
    }));
  }

  removeDisability(id: string) {
    this.disabilities.update(list => list.filter(d => d.id !== id));
  }

  importDisabilities(newDisabilities: Omit<Disability, 'id'>[]) {
    const withIds: Disability[] = newDisabilities.map(d => ({
      ...d,
      id: crypto.randomUUID()
    }));
    this.disabilities.update(list => [...list, ...withIds]);
  }

  clearAll() {
    this.disabilities.set([]);
  }

  toggleWholePersonChart() {
    this.showWholePersonChart.update(v => !v);
  }

  setTheme(newTheme: string) {
    this.theme.set(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  showReference(ref: ReferenceInfo) {
    this.selectedReference.set(ref);
  }

  closeReference() {
    this.selectedReference.set(null);
  }

  toggleThemePicker() {
    this.showThemePicker.update(v => !v);
  }

  calculate(disabilities: Disability[]): CalculationResult {
    const validDisabilities = disabilities.filter(d => d.rating >= 10);

    if (validDisabilities.length === 0) {
      return { rawPercentage: 0, combinedRating: 0, bilateralValue: 0, hasBilateralFactor: false, steps: [] };
    }

    const bilateralConditions = validDisabilities.filter(d => d.extremity !== 'none');
    const nonBilateralConditions = validDisabilities.filter(d => d.extremity === 'none');
    const hasBilateral = this.checkBilateralEligibility(bilateralConditions);

    let finalItems: { name: string, rating: number }[] = [];
    let bilateralValue = 0;

    if (hasBilateral) {
      const sortedBilateral = bilateralConditions.map(d => d.rating).sort((a, b) => b - a);
      const combinedBilateralRaw = this.combineSortedRatings(sortedBilateral).value;
      bilateralValue = combinedBilateralRaw + (combinedBilateralRaw * 0.1);
      
      finalItems = [
        { name: 'Bilateral Factor (Combined + 10%)', rating: bilateralValue },
        ...nonBilateralConditions.map(d => ({ name: d.name, rating: d.rating }))
      ];
    } else {
      finalItems = validDisabilities.map(d => ({ name: d.name, rating: d.rating }));
    }

    finalItems.sort((a, b) => b.rating - a.rating);

    const { value: rawPercentage, steps } = this.combineSortedRatingsDetailed(finalItems);
    const combinedRating = this.roundToNearestTen(rawPercentage);

    if (hasBilateral) {
      const sortedAll = validDisabilities.map(d => ({ name: d.name, rating: d.rating })).sort((a, b) => b.rating - a.rating);
      const { value: withoutBilateralRaw, steps: withoutBilateralSteps } = this.combineSortedRatingsDetailed(sortedAll);
      const withoutBilateralRounded = this.roundToNearestTen(withoutBilateralRaw);

      if (withoutBilateralRounded > combinedRating) {
        return {
          rawPercentage: withoutBilateralRaw,
          combinedRating: withoutBilateralRounded,
          bilateralValue: 0,
          hasBilateralFactor: false,
          steps: withoutBilateralSteps
        };
      }
    }

    return {
      rawPercentage,
      combinedRating,
      bilateralValue: hasBilateral ? bilateralValue : 0,
      hasBilateralFactor: hasBilateral,
      steps
    };
  }

  private checkBilateralEligibility(conditions: Disability[]): boolean {
    if (conditions.length < 2) return false;
    const extremities = new Set(conditions.map(c => c.extremity));
    const armsEligible = (extremities.has('left-arm') && extremities.has('right-arm'));
    const legsEligible = (extremities.has('left-leg') && extremities.has('right-leg'));
    return armsEligible || legsEligible;
  }

  private combineSortedRatings(ratings: number[]): { value: number, steps: CalculationStep[] } {
    const items = ratings.map(r => ({ name: 'Condition', rating: r }));
    return this.combineSortedRatingsDetailed(items);
  }

  private combineSortedRatingsDetailed(items: { name: string, rating: number }[]): { value: number, steps: CalculationStep[] } {
    let currentEfficiency = 100;
    let combinedValue = 0;
    const steps: CalculationStep[] = [];

    for (const item of items) {
      const disabilityEffect = (currentEfficiency * item.rating) / 100;
      combinedValue += disabilityEffect;
      currentEfficiency -= disabilityEffect;
      
      steps.push({
        name: item.name,
        rating: item.rating,
        appliedValue: disabilityEffect,
        remainingWholePerson: currentEfficiency
      });
    }

    return { value: combinedValue, steps };
  }

  private roundToNearestTen(value: number): number {
    const nearestWhole = Math.round(value);
    return Math.round(nearestWhole / 10) * 10;
  }
}
