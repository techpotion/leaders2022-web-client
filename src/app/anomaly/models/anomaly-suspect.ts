export interface BackendAnomalySuspect {
  root_id: string;
  anomaly_cases: number[];
  is_anomaly: boolean;
  is_custom: boolean;
  net_probability: number | null;
}

export interface AnomalySuspect {
  requestId: string;
  anomalyCases: number[];
  isAnomaly: boolean;
  isCustom: boolean;
  netProbability?: number;
}

export function fromBackendAnomalySuspect(
  suspect: BackendAnomalySuspect,
): AnomalySuspect {
  return {
    requestId: suspect.root_id,
    anomalyCases: suspect.anomaly_cases,
    isAnomaly: suspect.is_anomaly,
    isCustom: suspect.is_custom,
    netProbability: suspect.net_probability ?? undefined,
  };
}
