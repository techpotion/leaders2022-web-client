import { LatLng } from './lat-lng';
import { Request } from './request';

export interface FullRequest extends Request {
  position: LatLng;
  anomaly: {
    exists: boolean;
    isCustom: boolean;
    cases: number[];
    netProbability?: number | null;
  };
}
