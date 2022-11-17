interface AnalyticsValue {
  absolute: number;
  dynamics: {
    value: number;
    isPositive: boolean | null;
  };
}

export interface AnomalyAnalytics {
  percentage: AnalyticsValue;
  count: AnalyticsValue;
}

interface BackendAnalyticsValue {
  count: number;
  percent: number;
}

export interface BackendAnomalyAnalytics {
  previous: BackendAnalyticsValue;
  current: BackendAnalyticsValue;
}

export function fromBackendAnomalyAnalytics(
  analytics: BackendAnomalyAnalytics,
): AnomalyAnalytics {
  const percentageDynamics =
    analytics.current.percent - analytics.previous.percent;
  const isPercentageDynamicsPositive = percentageDynamics === 0
    ? null
    : percentageDynamics > 0;


  const countDynamics =
    analytics.current.count - analytics.previous.count;
  const isCountDynamicsPositive = countDynamics === 0
    ? null
    : countDynamics > 0;

  return {
    percentage: {
      absolute: analytics.current.percent,
      dynamics: {
        value: Math.abs(percentageDynamics),
        isPositive: isPercentageDynamicsPositive,
      },
    },
    count: {
      absolute: analytics.current.count,
      dynamics: {
        value: Math.abs(countDynamics),
        isPositive: isCountDynamicsPositive,
      },
    },
  };
}
