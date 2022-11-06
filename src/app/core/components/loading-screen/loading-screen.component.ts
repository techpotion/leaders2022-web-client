import { animate, group, query, sequence, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';


@Component({
  selector: 'tp-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('loading', [
      transition(':enter', [
        group([
          query('.white-filter', style({ opacity: 0 })),
          query('.blur-filter', style({ 'backdrop-filter': 'blur(0)' })),
          query('.illustration', style({ opacity: 0 }), { optional: true }),
          query('.hint-container', style({ opacity: 0 }), { optional: true }),
          query('.hint-container', style({ 'margin-top': 30 }), { optional: true }),
        ]),
        sequence([
          group([
            query('.white-filter', [
              animate('.2s ease-out', style({ opacity: '*' })),
            ]),
            query('.blur-filter', [
              animate('.2s ease-out', style({ 'backdrop-filter': '*' })),
            ]),
          ]),
          group([
            query('.illustration', [
              animate('.2s ease-out', style({ opacity: '*' })),
            ], { optional: true }),
            query('.hint-container', [
              animate('.2s ease-out', style({ opacity: '*' })),
            ], { optional: true }),
            query('.hint-container', [
              animate('.4s ease-out', style({ 'margin-top': '*' })),
            ], { optional: true }),
          ]),
        ]),
      ]),
      transition(':leave', [
        sequence([
          group([
            query('.hint-container', [
              animate('.2s ease-out', style({ opacity: 0 })),
            ], { optional: true }),
            query('.hint-container', [
              animate('.3s ease-out', style({ 'margin-top': 30 })),
            ], { optional: true }),
            query('.illustration', [
              animate('.2s ease-out', style({ opacity: 0 })),
            ], { optional: true }),
          ]),
          group([
            query('.white-filter', [
              animate('.2s ease-out', style({ opacity: 0 })),
            ]),
            query('.blur-filter', [
              animate('.2s ease-out', style({ 'backdrop-filter': 'blur(0)' })),
            ]),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class LoadingScreenComponent {

  constructor(
    public readonly service: LoadingService,
  ) { }

}
