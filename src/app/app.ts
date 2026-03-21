import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Disability, Extremity, ReferenceInfo } from './models';
import { VaCalculatorService } from './va-calculator.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private calculatorService = inject(VaCalculatorService);

  disabilities = signal<Disability[]>([]);
  
  // Form state
  newName = signal('');
  newRating = signal(10);
  newExtremity = signal<Extremity>('none');

  // Edit state
  editingId = signal<string | null>(null);
  editName = signal('');
  editRating = signal(10);
  editExtremity = signal<Extremity>('none');
  
  // Reference Modal State
  selectedReference = signal<ReferenceInfo | null>(null);

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

  availableRatings = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  
  extremityOptions: { value: Extremity; label: string }[] = [
    { value: 'none', label: 'None / Other' },
    { value: 'left-arm', label: 'Left Arm' },
    { value: 'right-arm', label: 'Right Arm' },
    { value: 'left-leg', label: 'Left Leg' },
    { value: 'right-leg', label: 'Right Leg' },
  ];

  result = computed(() => {
    return this.calculatorService.calculate(this.disabilities());
  });

  addDisability() {
    if (!this.newName().trim()) return;

    const newDisability: Disability = {
      id: crypto.randomUUID(),
      name: this.newName().trim(),
      rating: this.newRating(),
      extremity: this.newExtremity()
    };

    this.disabilities.update((list: Disability[]) => [...list, newDisability]);
    
    // Reset form
    this.newName.set('');
    this.newRating.set(10);
    this.newExtremity.set('none');
  }

  startEdit(d: Disability) {
    this.editingId.set(d.id);
    this.editName.set(d.name);
    this.editRating.set(d.rating);
    this.editExtremity.set(d.extremity);
  }

  saveEdit(d: Disability) {
    this.disabilities.update((list: Disability[]) => list.map((item: Disability) => {
      if (item.id === d.id) {
        const changed = item.name !== this.editName() || item.rating !== this.editRating() || item.extremity !== this.editExtremity();
        return {
          ...item,
          name: this.editName(),
          rating: this.editRating(),
          extremity: this.editExtremity(),
          isModified: changed || item.isModified
        };
      }
      return item;
    }));
    this.editingId.set(null);
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  removeDisability(id: string) {
    this.disabilities.update((list: Disability[]) => list.filter((d: Disability) => d.id !== id));
  }

  clearAll() {
    this.disabilities.set([]);
  }

  showReference(id: string) {
    this.selectedReference.set(this.references[id]);
  }

  closeReference() {
    this.selectedReference.set(null);
  }
}
