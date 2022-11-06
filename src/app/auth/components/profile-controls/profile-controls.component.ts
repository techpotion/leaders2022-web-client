import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingService } from 'src/app/core/services/loading.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'tp-profile-controls',
  templateUrl: './profile-controls.component.html',
  styleUrls: ['./profile-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileControlsComponent {

  constructor(
    private readonly auth: AuthService,
    private readonly loading: LoadingService,
  ) { }

  public async onSignOutClick(): Promise<void> {
    await this.auth.signOut();
    await this.loading.nagivateTo('/auth', false);
  }

}
