import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VaCalculatorService } from '../../va-calculator.service';
import { Extremity, AVAILABLE_RATINGS, EXTREMITY_OPTIONS } from '../../models';

@Component({
  selector: 'app-condition-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './condition-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionFormComponent {
  store = inject(VaCalculatorService);
  
  availableRatings = AVAILABLE_RATINGS;
  extremityOptions = EXTREMITY_OPTIONS;

  newName = signal('');
  newRating = signal(10);
  newExtremity = signal<Extremity>('none');

  addDisability() {
    if (!this.newName().trim()) return;
    this.store.addDisability(this.newName(), this.newRating(), this.newExtremity());
    
    // Reset defaults but keep standard baseline
    this.newName.set('');
    this.newRating.set(10);
    this.newExtremity.set('none');
  }
}
