import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, map, startWith } from 'rxjs';
import { DashboardDataService } from '../../services/dashboard-data.service';


@Component({
  selector: 'tp-service-rating-table',
  templateUrl: './service-rating-table.component.html',
  styleUrls: ['./service-rating-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceRatingTableComponent {

  constructor(
    private readonly data: DashboardDataService,
  ) { }


  // #region Search

  public readonly searchControl = new FormControl('', { nonNullable: true });

  public readonly searchedOptions = combineLatest([
    this.data.serviceRating,
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
    ),
  ]).pipe(
    map(([data, query]) => data.filter(
      element => element.service.toLowerCase().includes(query.toLowerCase()),
    )),
  );

  // #endregion

}
