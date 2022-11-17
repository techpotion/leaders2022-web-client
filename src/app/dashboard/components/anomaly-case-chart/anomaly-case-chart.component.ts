import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { map, Observable } from 'rxjs';
import { DialogService } from 'src/app/core/services/dialog.service';
import { DashboardDataService } from '../../services/dashboard-data.service';


// eslint-disable-next-line
const ANOMALY_CASES = [1, 2, 3, 4, 5, 6, 7, 8];

@Component({
  selector: 'tp-anomaly-case-chart',
  templateUrl: './anomaly-case-chart.component.html',
  styleUrls: ['./anomaly-case-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnomalyCaseChartComponent {

  constructor(
    private readonly data: DashboardDataService,
    public readonly dialog: DialogService,
  ) { }


  // #region Table

  private readonly tableData = this.data.caseChart.pipe(
    map(chart => ANOMALY_CASES.map(anomalyCase => {
      const chartElement = chart.find(element => element.case === anomalyCase);
      return {
        case: anomalyCase,
        count: chartElement?.count ?? 0,
        percentage: chartElement?.percentage ?? 0,
      };
    })),
  );

  public readonly sortedTableData = this.tableData.pipe(
    map(data => data.sort((a, b) => b.count - a.count)),
  );

  // #endregion


  // #region Chart

  public readonly chartData: Observable<ChartData<'bar'>> = this.tableData.pipe(
    map(data => ({
      labels: ANOMALY_CASES.map(anomalyCase => anomalyCase.toString()),
      datasets: [{
        data: data.map(element => element.count),
      }],
    })),
  );

  public readonly chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    backgroundColor: '#464F8C',
    scales: {
      xAxes: {
        grid: {
          color: 'transparent',
        },
      },
      yAxes: {
        grid: {
          color: 'transparent',
        },
        ticks: {
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // #endregion

  public openFaq(): void {
    this.dialog.faqDialogOpen.next(true);
  }

}
