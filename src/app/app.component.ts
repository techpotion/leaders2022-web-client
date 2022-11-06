import { ChangeDetectionStrategy, Component } from '@angular/core';

import { LoadingService } from './core/services/loading.service';


@Component({
  selector: 'tp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {

  constructor(
    public readonly loading: LoadingService,
  ) {}

}
