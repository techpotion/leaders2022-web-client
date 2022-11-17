import { Injectable } from '@angular/core';
import { TuiControlValueTransformer, TuiDay, TuiTime } from '@taiga-ui/cdk';


@Injectable()
export class DatetimeValueTransformer
implements TuiControlValueTransformer<[
  TuiDay | null,
  TuiTime | null,
], Date | null> {

  public fromControlValue(
    controlValue: Date | null,
  ): [TuiDay | null, TuiTime | null] {
    if (!controlValue) { return [null, null]; }

    const day = TuiDay.fromLocalNativeDate(controlValue);
    const time = !controlValue.getHours() && !controlValue.getMinutes()
      ? null
      : TuiTime.fromLocalNativeDate(controlValue);
    return [day, time];
  }

  public toControlValue(
    componentValue: [TuiDay | null, TuiTime | null],
  ): Date | null {
    const [day, time] = componentValue;
    if (!day) { return null; }

    const date = day.toLocalNativeDate();
    if (time) {
      date.setHours(time.hours);
      date.setMinutes(time.minutes);
    }
    return date;
  }

}
