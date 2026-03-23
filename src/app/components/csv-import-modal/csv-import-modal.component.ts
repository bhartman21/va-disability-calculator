import { Component, ChangeDetectionStrategy, inject, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaCalculatorService } from '../../va-calculator.service';
import { ParsedCsvResult } from '../../utils/csv-parser';

@Component({
  selector: 'app-csv-import-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './csv-import-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsvImportModalComponent {
  store = inject(VaCalculatorService);

  @Input() parsedData: ParsedCsvResult | null = null;
  @Output() close = new EventEmitter<void>();

  confirmImport() {
    if (this.parsedData && this.parsedData.serviceConnected.length > 0) {
      this.store.importDisabilities(this.parsedData.serviceConnected);
    }
    this.close.emit();
  }

  formatExtremity(extremity: string): string {
    const map: Record<string, string> = {
      'left-arm': 'Left Arm / Upper Extremity',
      'right-arm': 'Right Arm / Upper Extremity',
      'left-leg': 'Left Leg / Lower Extremity',
      'right-leg': 'Right Leg / Lower Extremity',
      'none': 'N/A'
    };
    return map[extremity] || 'N/A';
  }
}
