import { AnomalySuspect } from 'src/app/anomaly/models/anomaly-suspect';
import { FullRequest } from '../models/full-request';
import { Request } from '../models/request';
import { RequestLocation } from '../models/request-location';

export function mergeFullRequest(
  location: RequestLocation,
  request: Request,
  anomalySuspect: AnomalySuspect,
): FullRequest {
  if (
    request.id !== location.requestId
      || request.id !== anomalySuspect.requestId
  ) {
    throw new Error('Cannot merge full request. Ids are different.');
  }

  return {
    ...request,
    position: location.position,
    anomaly: {
      exists: anomalySuspect.isAnomaly,
      isCustom: anomalySuspect.isCustom,
      cases: anomalySuspect.anomalyCases,
      netProbability: anomalySuspect.netProbability,
    },
  };
}

export function mergeFullRequestArray(
  locations: RequestLocation[],
  requests: Request[],
  anomalySuspects: AnomalySuspect[],
): FullRequest[] {
  const requestMap: Record<string, {
    request: Request;
    location?: RequestLocation;
    anomalySuspect?: AnomalySuspect;
  }> = {};

  for (const request of requests) {
    requestMap[request.id] = { request };
  }

  for (const location of locations) {
    const element = requestMap[location.requestId];
    if (!element) {
      throw new Error('Cannot merge full requests array. Some elements are missing');
    }
    element.location = location;
  }

  for (const suspect of anomalySuspects) {
    const element = requestMap[suspect.requestId];
    if (!element) {
      throw new Error('Cannot merge full requests array. Some elements are missing');
    }
    element.anomalySuspect = suspect;
  }

  const mapElements = Object.values(requestMap);
  const fullRequests = [];
  for (const element of mapElements) {
    if (!element.anomalySuspect || !element.location) {
      throw new Error('Cannot merge full requests array. Some elements are missing');
    }
    fullRequests.push(mergeFullRequest(
      element.location,
      element.request,
      element.anomalySuspect,
    ));
  }

  return fullRequests;
}

export function mergeAnomalyIntoRequests(
  anomalySuspect: AnomalySuspect,
  requests: FullRequest[],
): FullRequest[] {
  const index = requests.findIndex(
    request => request.id === anomalySuspect.requestId,
  );
  const request = requests[index];
  if (!request) {
    throw new Error('Cannot merge anomaly suspect. Request is not found');
  }
  request.anomaly = {
    exists: anomalySuspect.isAnomaly,
    cases: anomalySuspect.anomalyCases,
    isCustom: anomalySuspect.isCustom,
    netProbability: anomalySuspect.netProbability,
  };
  requests.splice(index, 1, request);
  return requests;
}
