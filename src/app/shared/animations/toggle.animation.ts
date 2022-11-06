import { animate, AnimationTriggerMetadata, query, sequence, state, style, transition, trigger } from '@angular/animations';

export function toggleAnimation(): AnimationTriggerMetadata {
  return trigger('toggle', [
    state('open', style({})),
    state('closed', style({})),
    transition('open => closed', [
      query('.open-icon', style({ opacity: 0.1, 'max-width': 0 })),
      sequence([
        query('.close-icon', [
          animate('.2s ease-out', style({ opacity: 0.1 })),
          style({ 'max-width': 0 }),
        ]),
        query('.open-icon', [
          style({ 'max-width': 'none' }),
          animate('.2s ease-out', style({ opacity: '*' })),
        ]),
      ]),
    ]),
    transition('closed => open', [
      query('.close-icon', style({ opacity: 0.1, 'max-width': 0 })),
      sequence([
        query('.open-icon', [
          animate('.2s ease-out', style({ opacity: 0.1 })),
          style({ 'max-width': 0 }),
        ]),
        query('.close-icon', [
          style({ 'max-width': 'none' }),
          animate('.2s ease-out', style({ opacity: '*' })),
        ]),
      ]),
    ]),
  ]);
}
