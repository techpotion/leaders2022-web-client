export interface AnomalyDynamicsChartElement {
  date: Date;
  count: number;
}

export interface BackendAnomalyDynamicsChartElement {
  day: string;
  amount: number;
}

export function fromBackendAnomalyDynamicsChartData(
  data: BackendAnomalyDynamicsChartElement[],
): AnomalyDynamicsChartElement[] {
  return data.map(element => ({
    date: new Date(element.day),
    count: element.amount,
  }));
}
