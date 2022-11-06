import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs';
import { RequestsDataService } from '../../services/requests-data.service';


@Component({
  selector: 'tp-request-address-search',
  templateUrl: './request-address-search.component.html',
  styleUrls: ['./request-address-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestAddressSearchComponent {

  constructor(
    public readonly data: RequestsDataService,
  ) { }

  public readonly addresses = this.data.requests.pipe(
    map(requests => requests.map(request => request.address.full)),
    map(requests => requests.filter(
      (request, index, array) => array.indexOf(request) === index,
    )),
  );

}
