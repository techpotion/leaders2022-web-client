import { ChangeDetectionStrategy, Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { LoadingService } from 'src/app/core/services/loading.service';
import { RequestsMapEventService } from 'src/app/request/services/requests-map-event.service';

import { slideEnteringAnimation } from 'src/app/shared/animations/slide-entering.animation';


@Component({
  selector: 'tp-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    slideEnteringAnimation(),
  ],
})
export class AuthPageComponent {

  constructor(
    private readonly requestsMapEvents: RequestsMapEventService,
    private readonly loading: LoadingService,
  ) { }

  public async onAuthorization(): Promise<void> {
    await this.loading.nagivateTo(
      '', true, 'Загружаем карту, осталось еще немного',
      firstValueFrom(this.requestsMapEvents.load$),
    );
  }

}
