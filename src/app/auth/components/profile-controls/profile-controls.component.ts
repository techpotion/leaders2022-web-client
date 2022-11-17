import { animate, query, sequence, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'tp-profile-controls',
  templateUrl: './profile-controls.component.html',
  styleUrls: ['./profile-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('optionsAppearance', [
      transition(':enter', [
        style({ height: 0, width: 34 }),
        query('.option', style({ opacity: 0 })),
        sequence([
          animate('.2s ease-out', style({ height: '*', width: '*' })),
          query(
            '.option',
            animate('.2s ease-out', style({ opacity: '*' })),
          ),
        ]),
      ]),
      transition(':leave', [
        sequence([
          query(
            '.option',
            animate('.2s ease-out', style({ opacity: 0 })),
          ),
          animate('.2s ease-out', style({ height: 0, width: 34 })),
        ]),
      ]),
    ]),
  ],
})
export class ProfileControlsComponent {

  constructor(
    private readonly auth: AuthService,
    private readonly el: ElementRef,
    private readonly loading: LoadingService,
    public readonly router: Router,
  ) { }

  public async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.loading.nagivateTo('/auth', false);
  }

  public async navigateToDependence(): Promise<void> {
    const url = '/dependence';
    if (this.router.url === url) { return; }

    await this.loading.nagivateTo(url, false);
  }

  public async navigateToDashboard(): Promise<void> {
    const url = '/dashboard';
    if (this.router.url === url) { return; }

    await this.loading.nagivateTo(
      url, true, 'Загружаем дашборд. Осталось еще немного.',
    );
  }

  public async navigateToRequests(): Promise<void> {
    const url = '/requests';
    if (this.router.url === url) { return; }

    await this.loading.nagivateTo(
      url, true, 'Загружаем карту. Осталось еще немного.',
    );
  }


  // #region open state

  public readonly isOpen = new BehaviorSubject<boolean>(false);

  @HostListener('document:click', ['$event'])
  public onOutsideClick(event: MouseEvent): void {
    if ((this.el.nativeElement as HTMLElement).contains(
      event.target as HTMLElement,
    )) { return; }
    this.isOpen.next(false);
  }

  // #endregion

}
