import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'tp-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingScreenComponent {

  constructor(
    public readonly service: LoadingService,
  ) { }

}
