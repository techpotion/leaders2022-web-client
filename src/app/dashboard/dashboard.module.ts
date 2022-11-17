import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardPageComponent } from './components/dashboard-page/dashboard-page.component';
import { DashboardFiltersComponent } from './components/dashboard-filters/dashboard-filters.component';
import { DashboardAnomalyAnalyticsComponent } from './components/dashboard-anomaly-analytics/dashboard-anomaly-analytics.component';
import { AnomalyCaseChartComponent } from './components/anomaly-case-chart/anomaly-case-chart.component';
import { AnomalyDynamicsChartComponent } from './components/anomaly-dynamics-chart/anomaly-dynamics-chart.component';
import { ServiceRatingTableComponent } from './components/service-rating-table/service-rating-table.component';
import { DeffectRatingTableComponent } from './components/deffect-rating-table/deffect-rating-table.component';
import { OwnerRatingTableComponent } from './components/owner-rating-table/owner-rating-table.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    DashboardPageComponent,
    DashboardFiltersComponent,
    DashboardAnomalyAnalyticsComponent,
    AnomalyCaseChartComponent,
    AnomalyDynamicsChartComponent,
    ServiceRatingTableComponent,
    DeffectRatingTableComponent,
    OwnerRatingTableComponent,
  ],
  imports: [
    DashboardRoutingModule,
    AuthModule,
    NgChartsModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class DashboardModule { }
