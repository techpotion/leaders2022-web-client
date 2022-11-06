import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
  name: 'dateDelta',
})
export class DateDeltaPipe implements PipeTransform {

  public transform(dateFrom?: Date, dateTo?: Date): string {
    if (!dateFrom || !dateTo) { return ''; }

    const difference = moment.duration(moment(dateFrom).diff(moment(dateTo)));
    const diffDays = difference.days();
    const diffHours = difference.hours();
    const diffMinutes = difference.minutes();

    const days = diffDays ? `${diffDays } дн.` : '';
    const hours = diffHours ? `${diffHours } ч.` : '';
    const minutes = diffMinutes ? `${diffMinutes } мин.` : '';

    let returnString = '';
    if (days.length) {
      returnString = returnString + days;
    }
    if (hours.length) {
      if (returnString.length) {
        returnString = `${returnString } `;
      }
      returnString = returnString + hours;
    }
    if (minutes.length) {
      if (returnString.length) {
        returnString = `${returnString } `;
      }
      returnString = returnString + minutes;
    }

    return returnString;
  }

}
