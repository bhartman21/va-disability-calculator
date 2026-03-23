import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { VaCalculatorService } from '../../va-calculator.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  store = inject(VaCalculatorService);
}
