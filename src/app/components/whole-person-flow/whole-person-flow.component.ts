import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaCalculatorService } from '../../va-calculator.service';

@Component({
  selector: 'app-whole-person-flow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whole-person-flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WholePersonFlowComponent {
  store = inject(VaCalculatorService);
}
