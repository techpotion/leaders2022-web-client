import { animate, AnimationTriggerMetadata, group, query, sequence, style, transition, trigger } from '@angular/animations';

export function listAppearanceAnimation(
): AnimationTriggerMetadata {
  return trigger('listAppearance', [
    transition(':enter', [
      style({ width: 0 }),
      query('.top-container', style({ opacity: 0 })),
      query('.content-container', style({ opacity: 0 })),
      sequence([
        animate('.4s ease-out', style({ width: '*' })),
        group([
          query(
            '.top-container',
            animate('.2s ease-out', style({ opacity: '*' })),
          ),
          query(
            '.content-container',
            animate('.2s ease-out', style({ opacity: '*' })),
          ),
        ]),
      ]),
    ]),
    transition(':leave', [
      sequence([
        group([
          query(
            '.top-container',
            animate('.2s ease-out', style({ opacity: 0 })),
          ),
          query(
            '.content-container',
            animate('.2s ease-out', style({ opacity: 0 })),
          ),
        ]),
        animate('.4s ease-out', style({ width: 0 })),
      ]),
    ]),
  ]);
}
