import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, map, startWith } from 'rxjs';
import { DashboardDataService } from '../../services/dashboard-data.service';


@Component({
  selector: 'tp-deffect-rating-table',
  templateUrl: './deffect-rating-table.component.html',
  styleUrls: ['./deffect-rating-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeffectRatingTableComponent {

  constructor(
    private readonly data: DashboardDataService,
  ) { }


  // #region Search

  public readonly searchControl = new FormControl('', { nonNullable: true });

  public readonly searchedOptions = combineLatest([
    this.data.deffectRating,
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
    ),
  ]).pipe(
    map(([data, query]) => data.filter(
      element => element.deffect.toLowerCase().includes(query.toLowerCase()),
    )),
  );

  // #endregion

}
