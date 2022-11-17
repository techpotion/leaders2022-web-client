import { animate, AnimationTriggerMetadata, query, sequence, style, transition, trigger } from '@angular/animations';

export function addressAppearanceAnimation(
): AnimationTriggerMetadata {
  return trigger('addressAppearance', [
    transition(':enter', [
      style({ width: 0 }),
      query('.input', style({ opacity: 0 })),
      sequence([
        animate('.2s ease-out', style({ width: '*' })),
        query(
          '.input',
          animate('.2s ease-out', style({ opacity: '*' })),
        ),
      ]),
    ]),
    transition(':leave', [
      sequence([
        query(
          '.input',
          animate('.2s ease-out', style({ opacity: 0 })),
        ),
        animate('.2s ease-out', style({ width: 0 })),
      ]),
    ]),
  ]);
}
