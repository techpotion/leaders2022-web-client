import { animate, query, sequence, style, transition, trigger } from '@angular/animations';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewChecked, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { map, startWith } from 'rxjs';
import { RequestViewService } from '../../services/request-view.service';
import { RequestsDataService } from '../../services/requests-data.service';


@Component({
  selector: 'tp-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('opacityChangeState', [
      transition('noContent => emptyContent', [
        query('.empty-content-container', style({ opacity: 0 })),
        sequence([
          query(
            '.no-content-container',
            animate('.2s ease-out', style({ opacity: 0 })),
          ),
          query(
            '.empty-content-container',
            animate('.2s ease-out', style({ opacity: '*' })),
          ),
        ]),
      ]),
      transition('noContent => content', [
        query('.animation-content-container', style({ opacity: 0 })),
        sequence([
          query(
            '.no-content-container',
            animate('.2s ease-out', style({ opacity: 0 })),
          ),
          query(
            '.animation-content-container',
            animate('.2s ease-out', style({ opacity: '*' })),
          ),
        ]),
      ]),
      transition('emptyContent => content', [
        query('.animation-content-container', style({ opacity: 0 })),
        sequence([
          query(
            '.empty-content-container',
            animate('.2s ease-out', style({ opacity: 0 })),
          ),
          query(
            '.animation-content-container',
            animate('.2s ease-out', style({ opacity: '*' })),
          ),
        ]),
      ]),
      transition('content => emptyContent', [
        query('.empty-content-container', style({ opacity: 0 })),
        sequence([
          query(
            '.animation-content-container',
            animate('.2s ease-out', style({ opacity: 0 })),
          ),
          query(
            '.empty-content-container',
            animate('.2s ease-out', style({ opacity: '*' })),
          ),
        ]),
      ]),
    ]),
  ],
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

  public readonly animationState = this.data.requests.pipe(
    startWith(null),
    map(requests => {
      if (requests === null) {
        return 'noContent';
      }
      if (!requests.length) {
        return 'emptyContent';
      }
      return 'content';
    }),
  );

}
