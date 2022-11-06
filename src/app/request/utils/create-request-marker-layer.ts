import { filter, takeUntil } from 'rxjs';
import { RequestClusterPopupComponent } from '../components/request-cluster-popup/request-cluster-popup.component';
import { RequestMarkerPopupComponent } from '../components/request-marker-popup/request-marker-popup.component';
import { MarkerLayerSource } from '../models/map/marker-layer';
import { GET_ANOMALY_EXPRESSION, MarkerRequest } from '../models/map/marker-request';
import { createMarkerRequestGeoJson } from './create-marker-request-geojson';


export function createRequestMarkerLayer(
  requests: MarkerRequest[],
): MarkerLayerSource<
  MarkerRequest,
  RequestMarkerPopupComponent,
  RequestClusterPopupComponent
  > {
  return {
    data: createMarkerRequestGeoJson(requests),
    idMethod: obj => obj.id,
    image: {
      source: [
        {
          predicate: obj => obj.isIncident && obj.anomaly.exists,
          source: 'assets/icons/maroon-marker.svg',
        },
        {
          predicate: obj => obj.anomaly.exists && !obj.isIncident,
          source: 'assets/icons/red-marker.svg',
        },
        {
          predicate: obj => !obj.anomaly.exists && !obj.isIncident,
          source: 'assets/icons/green-marker.svg',
        },
      ],
      anchor: 'bottom',
    },
    className: 'request-marker',
    cluster: {
      properties: {
        // count of anomaly features
        anomaly: ['+', ['case', [
          '==',
          GET_ANOMALY_EXPRESSION,
          true,
        ], 1, 0]],
        // count of normal features
        normal: ['+', ['case', [
          '!=',
          GET_ANOMALY_EXPRESSION,
          true,
        ], 1, 0]],
      },
      background: [
        'case',
        // cluster does not contain anomaly features
        ['==', ['get', 'anomaly'], 0],
        '#004425',
        // cluster does not contain normal features
        ['==', ['get', 'normal'], 0],
        '#E13C08',
        '#FF8A00',
      ],
      color: '#FFFFFF',
      popup: {
        component: RequestClusterPopupComponent,
        onInit: (component, obj) => { component.requests = obj; },
        onClose: (component, cb) => {
          component.popupClose.pipe(
            takeUntil(component.destroy$),
          ).subscribe(() => cb());
        },
        registerClose: (component, closeEvent) => {
          closeEvent.pipe(
            takeUntil(component.destroy$),
            filter(() => !component.mouseInside.value),
          ).subscribe(() => component.popupClose.emit());
        },
      },
    },
    popup: {
      component: RequestMarkerPopupComponent,
      onInit: (component, obj) => { component.request = obj; },
      onClose: (component, cb) => {
        component.popupClose.pipe(
          takeUntil(component.destroy$),
        ).subscribe(() => cb());
      },
      registerClose: (component, closeEvent) => {
        closeEvent.pipe(
          takeUntil(component.destroy$),
          filter(() => !component.mouseInside.value),
        ).subscribe(() => component.popupClose.emit());
      },
    },
  };
}
