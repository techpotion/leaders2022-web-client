export interface DeffectRatingElement {
  deffect: string;
  count: number;
  percentage: number;
}

export interface BackendDeffectRatingElement {
  deffect_category: string;
  count: number;
  percent: number;
}

export function fromBackendDeffectRatingData(
  data: BackendDeffectRatingElement[],
): DeffectRatingElement[] {
  return data.map(element => ({
    deffect: element.deffect_category,
    count: element.count,
    percentage: element.percent,
  }));
}
