import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InputTextComponent } from './components/input-text/input-text.component';
import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';
import { InputPasswordComponent } from './components/input-password/input-password.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { SelectComponent } from './components/select/select.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { OptionSelectedPipe } from './pipes/option-selected.pipe';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { AutocompleteInputComponent } from './components/autocomplete-input/autocomplete-input.component';
import { JoinPipe } from './pipes/join.pipe';
import { DateDeltaPipe } from './pipes/date-delta.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { RadiobuttonComponent } from './components/radiobutton/radiobutton.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { FiltersUpdateButtonComponent } from './components/filters-update-button/filters-update-button.component';
import { TuiInputDateTimeModule } from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { ScrollingModule } from '@angular/cdk/scrolling';


@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    DateRangeComponent,
    FiltersUpdateButtonComponent,
    IconButtonComponent,
    InputTextComponent,
    InputPasswordComponent,
    SelectComponent,
    CheckboxComponent,
    OptionSelectedPipe,
    AutocompleteInputComponent,
    JoinPipe,
    DateDeltaPipe,
    DateFormatPipe,
    RadiobuttonComponent,
    ToggleComponent,
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    DateRangeComponent,
    FiltersUpdateButtonComponent,
    IconButtonComponent,
    InputTextComponent,
    InputPasswordComponent,
    SelectComponent,
    AutocompleteInputComponent,
    JoinPipe,
    DateDeltaPipe,
    DateFormatPipe,
    RadiobuttonComponent,
    ToggleComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ScrollingModule,
    TuiInputDateTimeModule,
    TuiTextfieldControllerModule,
  ],
})
export class SharedModule { }
