import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, map, startWith } from 'rxjs';
import { DashboardDataService } from '../../services/dashboard-data.service';


@Component({
  selector: 'tp-owner-rating-table',
  templateUrl: './owner-rating-table.component.html',
  styleUrls: ['./owner-rating-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerRatingTableComponent {

  constructor(
    private readonly data: DashboardDataService,
  ) { }


  // #region Search

  public readonly searchControl = new FormControl('', { nonNullable: true });

  public readonly searchedOptions = combineLatest([
    this.data.ownerRating,
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
    ),
  ]).pipe(
    map(([data, query]) => data.filter(
      element => element.owner.toLowerCase().includes(query.toLowerCase()),
    )),
  );

  // #endregion

}
