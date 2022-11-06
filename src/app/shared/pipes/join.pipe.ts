import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {

  public transform(
    value: (string | number)[],
    separator = ', ',
  ): string {
    return value.join(separator);
  }

}
