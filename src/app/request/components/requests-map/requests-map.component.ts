import { AfterViewInit, ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';

import { environment } from 'src/environments/environment';
import { RequestsMapEventService } from '../../services/requests-map-event.service';
import { RequestsMapControlService } from '../../services/requests-map-control.service';
import { RequestsMapMarkerService } from '../../services/requests-map-marker.service';
import { RequestsMapDataService } from '../../services/requests-map-data.service';


@Component({
  selector: 'tp-requests-map',
  templateUrl: './requests-map.component.html',
  styleUrls: ['./requests-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsMapComponent implements AfterViewInit {

  constructor(
    private readonly controls: RequestsMapControlService,
    private readonly data: RequestsMapDataService,
    private readonly events: RequestsMapEventService,
    private readonly markers: RequestsMapMarkerService,
  ) { }

  @HostBinding('id')
  public readonly id = 'requests-map';

  public map?: mapboxgl.Map;

  public ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.id,
      accessToken: environment.map.token,
      style: environment.map.style,
      center: environment.map.initCenter,
      zoom: environment.map.zoom.init,
      minZoom: environment.map.zoom.min,
      maxZoom: environment.map.zoom.max,
      dragRotate: false,
    });

    this.map.addControl(new MapboxLanguage({
      defaultLanguage: environment.map.language,
    }));

    this.controls.init(this.map);
    this.events.init(this.map);
    this.markers.init(this.map);
    this.data.init(this.map);
  }

}
