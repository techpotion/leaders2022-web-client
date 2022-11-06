import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../shared/shared.module';
import { RequestRoutingModule } from './request-routing.module';
import { RequestsPageComponent } from './components/requests-page/requests-page.component';
import { RequestsMapComponent } from './components/requests-map/requests-map.component';
import { RequestsMapZoomControlsComponent } from './components/requests-map-zoom-controls/requests-map-zoom-controls.component';
import { RequestsMapLegendComponent } from './components/requests-map-legend/requests-map-legend.component';
import { RequestsListToggleComponent } from './components/requests-list-toggle/requests-list-toggle.component';
import { RequestsFiltersComponent } from './components/requests-filters/requests-filters.component';
import { RequestAddressSearchComponent } from './components/request-address-search/request-address-search.component';
import { RequestsListComponent } from './components/requests-list/requests-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RequestsFiltersUpdateButtonComponent } from './components/requests-filters-update-button/requests-filters-update-button.component';
import { RequestsBriefAnalyticsComponent } from './components/requests-brief-analytics/requests-brief-analytics.component';
import { RequestCardComponent } from './components/request-card/request-card.component';
import { AnomalyModule } from '../anomaly/anomaly.module';
import { RequestMarkerPopupComponent } from './components/request-marker-popup/request-marker-popup.component';
import { RequestClusterPopupComponent } from './components/request-cluster-popup/request-cluster-popup.component';
import { RequestHeatmapToggleComponent } from './components/request-heatmap-toggle/request-heatmap-toggle.component';
import { SortNGroupControlComponent } from './components/sort-n-group-control/sort-n-group-control.component';


@NgModule({
  declarations: [
    RequestsPageComponent,
    RequestsMapComponent,
    RequestsMapZoomControlsComponent,
    RequestsMapLegendComponent,
    RequestsListToggleComponent,
    RequestsFiltersComponent,
    RequestAddressSearchComponent,
    RequestsListComponent,
    RequestsFiltersUpdateButtonComponent,
    RequestsBriefAnalyticsComponent,
    RequestCardComponent,
    RequestMarkerPopupComponent,
    RequestClusterPopupComponent,
    RequestHeatmapToggleComponent,
    SortNGroupControlComponent,
  ],
  imports: [
    RequestRoutingModule,
    AnomalyModule,
    AuthModule,
    CommonModule,
    ScrollingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class RequestModule { }
