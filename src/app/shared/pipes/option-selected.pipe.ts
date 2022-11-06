import { Pipe, PipeTransform } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SelectOption } from '../models/select-option';


@Pipe({
  name: 'optionSelected',
})
export class OptionSelectedPipe implements PipeTransform {

  public transform(
    option: SelectOption,
    control: Observable<SelectOption[]>,
  ): Observable<boolean> {
    return control.pipe(
      map(value => !!value.find(
        valueOption => valueOption.value === option.value,
      )),
    );
  }

}
