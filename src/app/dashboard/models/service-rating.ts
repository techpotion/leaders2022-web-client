export interface ServiceRatingElement {
  service: string;
  count: number;
  percentage: number;
}

export interface BackendServiceRatingElement {
  serving_company: string;
  count: number;
  percent: number;
}

export function fromBackendServiceRatingData(
  data: BackendServiceRatingElement[],
): ServiceRatingElement[] {
  return data.map(element => ({
    service: element.serving_company,
    count: element.count,
    percentage: element.percent,
  }));
}
