import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VaCalculatorService } from '../../va-calculator.service';
import { Disability, Extremity, AVAILABLE_RATINGS, EXTREMITY_OPTIONS } from '../../models';
import { parseCsv, ParsedCsvResult } from '../../utils/csv-parser';
import { CsvImportModalComponent } from '../csv-import-modal/csv-import-modal.component';

@Component({
  selector: 'app-conditions-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CsvImportModalComponent],
  templateUrl: './conditions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConditionsListComponent {
  store = inject(VaCalculatorService);
  
  availableRatings = AVAILABLE_RATINGS;
  extremityOptions = EXTREMITY_OPTIONS;

  editingId = signal<string | null>(null);
  editName = '';
  editRating = 10;
  editExtremity: Disability['extremity'] = 'none';
  editDc = '';

  parsedCsvData = signal<ParsedCsvResult | null>(null);
  csvError = signal<string | null>(null);

  startEdit(d: Disability) {
    this.editingId.set(d.id);
    this.editName = d.name;
    this.editRating = d.rating;
    this.editExtremity = d.extremity;
    this.editDc = d.diagnosticCode || '';
  }

  saveEdit(d: Disability) {
    if (!this.editName.trim()) return;
    this.store.updateDisability({
      ...d,
      name: this.editName.trim(),
      rating: Number(this.editRating),
      extremity: this.editExtremity,
      diagnosticCode: this.editDc.trim() || undefined
    });
    this.editingId.set(null);
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        try {
          const result = parseCsv(content);
          this.parsedCsvData.set(result);
          this.csvError.set(null);
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          this.parsedCsvData.set(null);
          this.csvError.set(msg);
        }
      }
      // Reset input so the same file can be selected again if needed
      input.value = '';
    };

    reader.readAsText(file);
  }

  closeCsvModal() {
    this.parsedCsvData.set(null);
  }
}
