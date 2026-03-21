import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { VaCalculatorService } from '../../va-calculator.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  store = inject(VaCalculatorService);
}
