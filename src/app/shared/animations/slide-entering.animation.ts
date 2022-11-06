import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';


export function slideEnteringAnimation(
): AnimationTriggerMetadata {
  return trigger('slideEntering', [
    transition(':enter', [
      style({
        'margin-bottom': 100,
        opacity: 0,
      }),
      animate('1s cubic-bezier(.30,.70,.30,.70)', style({
        'margin-bottom': '*',
        opacity: '*',
      })),
    ]),
  ]);
}
