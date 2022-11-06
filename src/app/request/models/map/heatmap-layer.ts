// eslint-disable-next-line
export interface HeatmapLayerSource<T = any> {
  data: GeoJSON.FeatureCollection<GeoJSON.Point, T>;
  property: keyof T;
  radiusStops: {
    zoom: number;
    radius: number;
  }[];
}

// eslint-disable-next-line
export interface HeatmapLayer<T = any> {
  id: string;
  source: HeatmapLayerSource<T>;
}
