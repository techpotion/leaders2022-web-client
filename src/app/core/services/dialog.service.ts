import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DialogService {

  constructor() { }

  public readonly faqDialogOpen = new BehaviorSubject<boolean>(false);

}
