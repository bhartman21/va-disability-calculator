import { Injectable } from '@angular/core';
import { Disability, CalculationResult } from './models';

@Injectable({
  providedIn: 'root'
})
export class VaCalculatorService {

  calculate(disabilities: Disability[]): CalculationResult {
    // 1. Filter: Include 10% to 100%
    const validDisabilities = disabilities.filter(d => d.rating >= 10);

    if (validDisabilities.length === 0) {
      return { rawPercentage: 0, combinedRating: 0, bilateralValue: 0, hasBilateralFactor: false };
    }

    // 2. Identify Bilateral Conditions
    const bilateralConditions = validDisabilities.filter(d => d.extremity !== 'none');
    const nonBilateralConditions = validDisabilities.filter(d => d.extremity === 'none');

    // Check if bilateral factor actually applies (needs at least two different extremities or paired)
    // VA rule: "both arms, both legs, or paired skeletal muscles"
    // We'll group by side/type
    const hasBilateral = this.checkBilateralEligibility(bilateralConditions);

    let finalRatings: number[] = [];
    let bilateralValue = 0;

    if (hasBilateral) {
      // Combine bilateral conditions first
      const combinedBilateralRaw = this.combineSortedRatings(
        bilateralConditions.map(d => d.rating).sort((a, b) => b - a)
      );
      
      // Add 10% bilateral factor
      bilateralValue = combinedBilateralRaw + (combinedBilateralRaw * 0.1);
      
      // Treat as a single disability
      finalRatings = [bilateralValue, ...nonBilateralConditions.map(d => d.rating)];
    } else {
      finalRatings = validDisabilities.map(d => d.rating);
    }

    // 3. Rank all by severity
    finalRatings.sort((a, b) => b - a);

    // 4. Combine
    const rawPercentage = this.combineSortedRatings(finalRatings);

    // 5. Final Rounding
    const combinedRating = this.roundToNearestTen(rawPercentage);

    // 6. Exception Rule: Check if without bilateral factor it's better
    if (hasBilateral) {
      const withoutBilateralRaw = this.combineSortedRatings(
        validDisabilities.map(d => d.rating).sort((a, b) => b - a)
      );
      const withoutBilateralRounded = this.roundToNearestTen(withoutBilateralRaw);

      if (withoutBilateralRounded > combinedRating) {
        return {
          rawPercentage: withoutBilateralRaw,
          combinedRating: withoutBilateralRounded,
          bilateralValue: 0,
          hasBilateralFactor: false
        };
      }
    }

    return {
      rawPercentage,
      combinedRating,
      bilateralValue: hasBilateral ? bilateralValue : 0,
      hasBilateralFactor: hasBilateral
    };
  }

  private checkBilateralEligibility(conditions: Disability[]): boolean {
    if (conditions.length < 2) return false;
    
    const extremities = new Set(conditions.map(c => c.extremity));
    
    // If we have at least one on each side of the same type (upper/lower)
    const armsEligible = (extremities.has('left-arm') && extremities.has('right-arm'));
    const legsEligible = (extremities.has('left-leg') && extremities.has('right-leg'));

    return armsEligible || legsEligible;
  }

  private combineSortedRatings(ratings: number[]): number {
    if (ratings.length === 0) return 0;
    
    let currentEfficiency = 100;
    let combinedValue = 0;

    for (const rating of ratings) {
      const disabilityEffect = (currentEfficiency * rating) / 100;
      combinedValue += disabilityEffect;
      currentEfficiency -= disabilityEffect;
    }

    return combinedValue;
  }

  private roundToNearestTen(value: number): number {
    // VA rounding: 
    // 1. Round the raw value to the nearest whole number (e.g., 74.5 -> 75)
    // 2. Round that whole number to the nearest 10 (e.g., 75 -> 80, 74 -> 70)
    const nearestWhole = Math.round(value);
    return Math.round(nearestWhole / 10) * 10;
  }
}
