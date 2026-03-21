import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VaCalculatorService } from '../../va-calculator.service';
import { Disability, Extremity, AVAILABLE_RATINGS, EXTREMITY_OPTIONS } from '../../models';

@Component({
  selector: 'app-conditions-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conditions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionsListComponent {
  store = inject(VaCalculatorService);
  
  availableRatings = AVAILABLE_RATINGS;
  extremityOptions = EXTREMITY_OPTIONS;

  editingId = signal<string | null>(null);
  editName = '';
  editRating = 0;
  editExtremity: Extremity = 'none';

  startEdit(d: Disability) {
    this.editingId.set(d.id);
    this.editName = d.name;
    this.editRating = d.rating;
    this.editExtremity = d.extremity;
  }

  saveEdit(d: Disability) {
    if (!this.editName.trim()) return;
    this.store.updateDisability({
      ...d,
      name: this.editName.trim(),
      rating: Number(this.editRating),
      extremity: this.editExtremity
    });
    this.editingId.set(null);
  }

  cancelEdit() {
    this.editingId.set(null);
  }
}
