import { FullRequest } from '../models/full-request';
import { RequestSortOption } from '../models/request-sort-options';

export function sortRequests(
  requests: FullRequest[],
  option: RequestSortOption,
): FullRequest[] {
  return requests.sort((a, b) => {
    const ascending = option === RequestSortOption.CreationDateAscending
    || option === RequestSortOption.CloseDateAscending;

    const creation = option === RequestSortOption.CreationDateAscending
    || option === RequestSortOption.CreationDateDescending;

    if (creation) {
      if (!a.creationDate && !b.creationDate) {
        return 0;
      }
      if (!a.creationDate) {
        return ascending ? -1 : 1;
      }
      if (!b.creationDate) {
        return ascending ? 1 : -1;
      }

      if (ascending) {
        return a.creationDate.getTime() - b.creationDate.getTime();
      } 
      return b.creationDate.getTime() - a.creationDate.getTime();
      
    } 
    if (!a.closeDate && !b.closeDate) {
      return 0;
    }
    if (!a.closeDate) {
      return ascending ? -1 : 1;
    }
    if (!b.closeDate) {
      return ascending ? 1 : -1;
    }

    if (ascending) {
      return a.closeDate.getTime() - b.closeDate.getTime();
    } 
    return b.closeDate.getTime() - a.closeDate.getTime();
      
    
  });
}
