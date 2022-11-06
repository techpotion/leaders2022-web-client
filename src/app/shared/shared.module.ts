import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

import { InputTextComponent } from './components/input-text/input-text.component';
import { ButtonComponent } from './components/button/button.component';
import { CardComponent } from './components/card/card.component';
import { InputPasswordComponent } from './components/input-password/input-password.component';
import { IconButtonComponent } from './components/icon-button/icon-button.component';
import { SelectComponent } from './components/select/select.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { OptionSelectedPipe } from './pipes/option-selected.pipe';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AutocompleteInputComponent } from './components/autocomplete-input/autocomplete-input.component';
import { JoinPipe } from './pipes/join.pipe';
import { DateDeltaPipe } from './pipes/date-delta.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { RadiobuttonComponent } from './components/radiobutton/radiobutton.component';


@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    DateRangeComponent,
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
  ],
  exports: [
    ButtonComponent,
    CardComponent,
    DateRangeComponent,
    IconButtonComponent,
    InputTextComponent,
    InputPasswordComponent,
    SelectComponent,
    AutocompleteInputComponent,
    JoinPipe,
    DateDeltaPipe,
    DateFormatPipe,
    RadiobuttonComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatTimepickerModule,
    MatDatepickerModule,
    NgxMatNativeDateModule,
  ],
})
export class SharedModule { }
