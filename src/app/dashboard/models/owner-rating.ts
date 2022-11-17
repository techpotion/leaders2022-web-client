export interface OwnerRatingElement {
  owner: string;
  count: number;
  percentage: number;
}

export interface BackendOwnerRatingElement {
  owner_company: string;
  count: number;
  percent: number;
}

export function fromBackendOwnerRatingData(
  data: BackendOwnerRatingElement[],
): OwnerRatingElement[] {
  return data.map(element => ({
    owner: element.owner_company,
    count: element.count,
    percentage: element.percent,
  }));
}
