import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ReferenceModalComponent } from './components/reference-modal/reference-modal.component';
import { ConditionsListComponent } from './components/conditions-list/conditions-list.component';
import { ConditionFormComponent } from './components/condition-form/condition-form.component';
import { WholePersonFlowComponent } from './components/whole-person-flow/whole-person-flow.component';
import { InfoSectionComponent } from './components/info-section/info-section.component';
import { ThemePickerComponent } from './components/theme-picker/theme-picker.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    ReferenceModalComponent,
    ConditionsListComponent,
    ConditionFormComponent,
    WholePersonFlowComponent,
    InfoSectionComponent,
    ThemePickerComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
