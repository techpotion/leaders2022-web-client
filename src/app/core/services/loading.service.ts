import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
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

  public readonly globalScreen = new BehaviorSubject<boolean>(false);

  public isGlobalScreenBlackout = false;

  public showLoader = true;

  public loaderText?: string;

  public async nagivateTo(
    url: string,
    showLoader = true,
    loaderText: string | undefined = undefined,
    waitFor: Promise<unknown> | undefined = undefined,
  ): Promise<void> {
    this.isGlobalScreenBlackout = true;
    this.loaderText = loaderText;
    this.showLoader = showLoader;

    this.globalScreen.next(true);
    await sleep(FILTER_ANIMATION_DURATION
                + (showLoader ? LOADER_ANIMATION_DURATION : 0)
                + (loaderText
                  ? LOADER_TEXT_ANIMATION_DURATION - LOADER_ANIMATION_DURATION
                  : 0));

    await this.router.navigateByUrl(url);
    if (waitFor) {
      await waitFor;
    }

    await sleep(FILTER_ANIMATION_DURATION
                + (showLoader ? LOADER_ANIMATION_DURATION : 0)
                + (loaderText
                  ? LOADER_TEXT_ANIMATION_DURATION - LOADER_ANIMATION_DURATION
                  : 0));
    this.globalScreen.next(false);
  }

  public async openLoader(
    loaderText: string | undefined = undefined,
  ): Promise<void> {
    this.isGlobalScreenBlackout = false;
    this.loaderText = loaderText;
    this.showLoader = true;
    this.globalScreen.next(true);

    await sleep(FILTER_ANIMATION_DURATION
                + LOADER_ANIMATION_DURATION
                + (loaderText
                  ? LOADER_TEXT_ANIMATION_DURATION - LOADER_ANIMATION_DURATION
                  : 0));
  }

  public async closeLoader(): Promise<void> {
    if (!this.globalScreen.value) {
      return;
    }

    await sleep(FILTER_ANIMATION_DURATION
                + LOADER_ANIMATION_DURATION
                + (this.loaderText
                  ? LOADER_TEXT_ANIMATION_DURATION - LOADER_ANIMATION_DURATION
                  : 0));
    this.globalScreen.next(false);
  }

}
