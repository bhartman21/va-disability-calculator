import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VaCalculatorService } from '../../va-calculator.service';

interface ThemeOption {
  id: string;
  name: string;
  primaryClass: string;
  accentClass: string;
}

@Component({
  selector: 'app-theme-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent {
  store = inject(VaCalculatorService);

  themeOptions: ThemeOption[] = [
    { id: 'army', name: 'Army', primaryClass: 'bg-zinc-900', accentClass: 'bg-yellow-400' },
    { id: 'marines', name: 'Marine Corps', primaryClass: 'bg-red-900', accentClass: 'bg-yellow-500' },
    { id: 'navy', name: 'Navy', primaryClass: 'bg-slate-900', accentClass: 'bg-amber-500' },
    { id: 'airforce', name: 'Air Force', primaryClass: 'bg-blue-800', accentClass: 'bg-yellow-400' },
    { id: 'spaceforce', name: 'Space Force', primaryClass: 'bg-sky-950', accentClass: 'bg-slate-300' },
    { id: 'coastguard', name: 'Coast Guard', primaryClass: 'bg-sky-800', accentClass: 'bg-red-600' }
  ];

  selectTheme(themeId: string) {
    this.store.setTheme(themeId);
    this.store.toggleThemePicker();
  }
}
