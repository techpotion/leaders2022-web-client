import { animate, query, sequence, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, merge, startWith } from 'rxjs';


@Component({
  selector: 'tp-requests-map-legend',
  templateUrl: './requests-map-legend.component.html',
  styleUrls: ['./requests-map-legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('open', [
      state('open', style({
        background: 'rgba(255, 255, 255, 0.7)',
        'border-radius': 8,
        width: 460,
        height: 145,
        'backdrop-filter': 'blur(2px)',
        'box-shadow': 'none',
      })),
      state('closed', style({
        background: '#ffffff',
        'border-radius': 4,
        width: 40,
        height: 40,
        'backdrop-filter': 'none',
        'box-shadow': 'var(--default-shadow)',
      })),
      transition('closed => open', [
        query('.legend-container', style({ opacity: 0, 'max-height': 0 })),
        sequence([
          query('.toggle-button', [
            animate('.2s ease-out', style({ opacity: 0 })),
            style({ 'max-height': 0 }),
          ]),
          animate('.2s ease-out'),
          query('.legend-container', [
            style({ 'max-height': 'none' }),
            animate('.2s ease-out', style({ opacity: '*' })),
          ]),
        ]),
      ]),
      transition('open => closed', [
        query('.toggle-button', style({ opacity: 0, 'max-height': 0 })),
        sequence([
          query('.legend-container', [
            animate('.2s ease-out', style({ opacity: 0 })),
          ]),
          animate('.2s ease-out'),
          query('.toggle-button', [
            style({ 'max-height': 'none' }),
            animate('.2s ease-out', style({ opacity: '*' })),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class RequestsMapLegendComponent {

  constructor() { }

  // #region Open state

  public readonly mouseenter = new EventEmitter<void>();

  public readonly mouseleave = new EventEmitter<void>();

  public readonly animationInProgress = new BehaviorSubject<boolean>(false);

  public readonly isOpen = combineLatest([
    merge(
      this.mouseenter.pipe(
        map(() => true),
      ),
      this.mouseleave.pipe(
        map(() => false),
      ),
    ),
    this.animationInProgress,
  ]).pipe(
    filter(([, animationInProgress]) => !animationInProgress),
    map(([mouseInside]) => mouseInside),
    startWith(false),
  );

  public readonly animationState = this.isOpen.pipe(
    map(isOpen => isOpen ? 'open' : 'closed'),
  );

  // #endregion

}
