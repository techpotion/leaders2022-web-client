import { FullRequest } from '../models/full-request';
import { RequestGroupOption } from '../models/request-sort-options';
import { Urgency } from '../models/urgency';

export function groupRequests(
  requests: FullRequest[],
  option: RequestGroupOption,
): FullRequest[][] {
  if (option === RequestGroupOption.AnomalyFirst) {
    return [
      requests.filter(request => request.anomaly.exists),
      requests.filter(request => !request.anomaly.exists),
    ];
  }

  if (option === RequestGroupOption.NormalFirst) {
    return [
      requests.filter(request => !request.anomaly.exists),
      requests.filter(request => request.anomaly.exists),
    ];
  }

  if (option === RequestGroupOption.IncidentFirst) {
    return [
      requests.filter(request => request.isIncident && request.anomaly.exists),
      requests.filter(
        request => !(request.isIncident && request.anomaly.exists),
      ),
    ];
  }

  if (option === RequestGroupOption.Urgency) {
    return [
      requests.filter(request => request.urgency.ru === Urgency.Emergency),
      requests.filter(request => request.urgency.ru === Urgency.Normal),
      requests.filter(request => !request.urgency.ru),
    ];
  }

  const map = new Map<string, FullRequest[]>();
  for (const request of requests) {
    const key = request.deffect.code;
    const group = map.get(key) ?? [];
    group.push(request);
    map.set(key, group);
  }
  return Array.from(map.values());
}
