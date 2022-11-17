import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, filter, firstValueFrom, map, skip } from 'rxjs';
import { sleep } from 'src/app/shared/utils/sleep';


const FILTER_ANIMATION_DURATION = 200;
const LOADER_ANIMATION_DURATION = 200;
const LOADER_TEXT_ANIMATION_DURATION = 300;

@Injectable({
  providedIn: 'root',
})
export class LoadingService {

  constructor(
    private readonly router: Router,
  ) { }


  // #region Navigation

  private readonly navigationLoading = new BehaviorSubject<boolean>(false);

  public readonly navigationLoading$ = this.navigationLoading.asObservable();

  public startNavigationLoading(
    showLoader = true,
    loaderText: string | undefined = undefined,
  ): void {
    this.loaderText = loaderText;
    this.showLoader = showLoader;

    this.navigationLoading.next(true);
  }

  public async nagivateTo(
    url: string,
    showLoader = true,
    loaderText: string | undefined = undefined,
  ): Promise<void> {
    this.isGlobalScreenBlackout = true;

    this.startNavigationLoading(showLoader, loaderText);
    await sleep(FILTER_ANIMATION_DURATION
                + (showLoader ? LOADER_ANIMATION_DURATION : 0)
                + (loaderText
                  ? LOADER_TEXT_ANIMATION_DURATION - LOADER_ANIMATION_DURATION
                  : 0));

    await this.router.navigateByUrl(url);
    await firstValueFrom(this.navigationLoading.pipe(
      skip(1),
      filter(loading => !loading),
    ));

    await sleep(FILTER_ANIMATION_DURATION
                + (showLoader ? LOADER_ANIMATION_DURATION : 0)
                + (loaderText
                  ? LOADER_TEXT_ANIMATION_DURATION - LOADER_ANIMATION_DURATION
                  : 0));
  }

  public finishNavigationLoading(): void {
    this.navigationLoading.next(false);
  }

  // #endregion


  // #region Data loading

  public readonly dataLoading = new BehaviorSubject<boolean>(false);

  // #endregion


  public readonly loading = combineLatest([
    this.navigationLoading,
    this.dataLoading,
  ]).pipe(
    map(([navigation, data]) => navigation || data),
  );

  public isGlobalScreenBlackout = false;

  public showLoader = true;

  public loaderText?: string;

  public async openLoader(
    loaderText: string | undefined = undefined,
  ): Promise<void> {
    this.isGlobalScreenBlackout = false;
    this.loaderText = loaderText;
    this.showLoader = true;
    this.dataLoading.next(true);

    await sleep(FILTER_ANIMATION_DURATION
                + LOADER_ANIMATION_DURATION
                + (loaderText
                  ? LOADER_TEXT_ANIMATION_DURATION - LOADER_ANIMATION_DURATION
                  : 0));
  }

  public async closeLoader(): Promise<void> {
    if (!this.dataLoading.value) {
      return;
    }

    await sleep(FILTER_ANIMATION_DURATION
                + LOADER_ANIMATION_DURATION
                + (this.loaderText
                  ? LOADER_TEXT_ANIMATION_DURATION - LOADER_ANIMATION_DURATION
                  : 0));
    this.dataLoading.next(false);
  }

}
