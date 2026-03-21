import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { VaCalculatorService } from '../../va-calculator.service';

@Component({
  selector: 'app-reference-modal',
  standalone: true,
  templateUrl: './reference-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferenceModalComponent {
  store = inject(VaCalculatorService);
}
