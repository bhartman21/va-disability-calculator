import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaCalculatorService } from '../../va-calculator.service';

@Component({
  selector: 'app-info-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoSectionComponent {
  store = inject(VaCalculatorService);
}
