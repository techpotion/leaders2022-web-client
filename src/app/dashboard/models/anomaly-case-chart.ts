export interface AnomalyCaseChartElement {
  count: number;
  percentage: number;
  case: number;
}

export interface BackendAnomalyCaseChartElement {
  count: number;
  percent: number;
  type: number;
}

export function fromBackendAnomalyCaseChartData(
  data: BackendAnomalyCaseChartElement[],
): AnomalyCaseChartElement[] {
  return data.map(element => ({
    count: element.count,
    percentage: element.percent,
    case: element.type,
  }));
}
