import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export function opacityAppearanceAnimation(): AnimationTriggerMetadata {
  return trigger('opacityAppearance', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('.2s ease-out', style({ opacity: '*' })),
    ]),
    transition(':leave', [
      animate('.2s ease-out', style({ opacity: 0 })),
    ]),
  ]);
}
