import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RequestsMapControlService } from '../../services/requests-map-control.service';


@Component({
  selector: 'tp-requests-map-zoom-controls',
  templateUrl: './requests-map-zoom-controls.component.html',
  styleUrls: ['./requests-map-zoom-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsMapZoomControlsComponent {

  constructor(
    public readonly mapControls: RequestsMapControlService,
  ) { }

}
