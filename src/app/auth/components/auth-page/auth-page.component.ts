import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';

import { LoadingService } from 'src/app/core/services/loading.service';

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
export class AuthPageComponent implements AfterViewInit {

  constructor(
    private readonly loader: LoadingService,
  ) { }


  // #region Lifecycle

  public ngAfterViewInit(): void {
    this.loader.finishNavigationLoading();
  }

  // #endregion


  public async onAuthorization(): Promise<void> {
    await this.loader.nagivateTo(
      '', true, 'Загружаем карту, осталось еще немного',
    );
  }

}
