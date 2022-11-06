import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';


export function slideBelowAnimation(
): AnimationTriggerMetadata {
  return trigger('slideBelow', [
    transition(':enter', [
      style({ bottom: 0 }),
      animate('.3s cubic-bezier(.30,.70,.30,.70)', style({ bottom: '*' })),
    ]),
    transition(':leave', [
      style({ bottom: '*' }),
      animate('.3s cubic-bezier(.70,.30,.70,.30)', style({ bottom: 0 })),
    ]),
  ]);
}
