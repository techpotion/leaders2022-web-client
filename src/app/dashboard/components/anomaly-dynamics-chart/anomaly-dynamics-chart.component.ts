import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { map, Observable } from 'rxjs';
import { DashboardDataService } from '../../services/dashboard-data.service';
import 'chartjs-adapter-moment';
import * as moment from 'moment';

moment.locale('ru');

@Component({
  selector: 'tp-anomaly-dynamics-chart',
  templateUrl: './anomaly-dynamics-chart.component.html',
  styleUrls: ['./anomaly-dynamics-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnomalyDynamicsChartComponent {

  constructor(
    private readonly data: DashboardDataService,
  ) { }

  public readonly chartData =
    this.data.dynamicsChart.pipe(
      map(chart => ({
        labels: [],
        datasets: [{
          data: chart.chartData.map(element => ({
            x: element.date,
            y: element.count,
          })),
          pointBackgroundColor: '#FFFFFF',
          pointBorderColor: '#004425',
          pointRadius: 4,
        }],
      })),
    );

  public readonly chartOptions: Observable<ChartConfiguration['options']> =
    this.data.dynamicsChart.pipe(
      map(() => ({
        responsive: true,
        maintainAspectRatio: false,
        borderColor: '#004425',
        scales: {
          xAxes: {
            type: 'time',
            distribution: 'linear',
            grid: {
              color: 'transparent',
            },
          },
          yAxes: {
            grid: {
              color: 'transparent',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: context => {
                const date = (context[0]?.raw as { x: Date }).x;
                return moment(date).format('dd, D MMMM YYYY');
              },
            },
          },
        },
      })),
    );

}
