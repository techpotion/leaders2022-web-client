import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faqDialogAppearanceAnimation } from './animations/faq-dialog-appearance.animation';
import { loadingScreenAppearanceAnimation } from './core/animations/loading-screen-appearance.animation';
import { DialogService } from './core/services/dialog.service';

import { LoadingService } from './core/services/loading.service';


@Component({
  selector: 'tp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // eslint-disable-next-line
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    faqDialogAppearanceAnimation(),
    loadingScreenAppearanceAnimation(),
  ],
})
export class AppComponent {

  constructor(
    public readonly dialog: DialogService,
    public readonly loader: LoadingService,
  ) {}

}
