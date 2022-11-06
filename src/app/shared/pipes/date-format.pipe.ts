import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

moment.locale('ru');

@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {

  public transform(value?: Date): string {
    if (!value) { return ''; }
    return moment(value).format('D MMMM YYYY, HH:mm');
  }

}
