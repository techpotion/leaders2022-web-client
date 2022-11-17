export interface PolygonLayerSource {
  data: GeoJSON.Polygon;
  background: {
    color: string;
    opacity: number;
  };
  stroke: {
    color: string;
    width: number;
  };
}

export interface PolygonLayer {
  id: string;
  source: PolygonLayerSource;
}
