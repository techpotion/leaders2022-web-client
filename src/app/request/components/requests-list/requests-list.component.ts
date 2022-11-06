import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewChecked, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { RequestViewService } from '../../services/request-view.service';
import { RequestsDataService } from '../../services/requests-data.service';


@Component({
  selector: 'tp-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsListComponent implements AfterViewChecked {

  constructor(
    public readonly data: RequestsDataService,
    private readonly view: RequestViewService,
  ) { }

  public ngAfterViewChecked(): void {
    if (this.scrollViewport) {
      this.view.init(this.scrollViewport);
    }
  }

  @ViewChild('scrollViewport')
  public readonly scrollViewport?: CdkVirtualScrollViewport;

}
