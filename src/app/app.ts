import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Disability, Extremity } from './models';
import { VaCalculatorService } from './va-calculator.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
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

    this.disabilities.update(list => [...list, newDisability]);
    
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
    this.disabilities.update(list => list.map(item => {
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
    this.disabilities.update(list => list.filter(d => d.id !== id));
  }

  clearAll() {
    this.disabilities.set([]);
  }
}
