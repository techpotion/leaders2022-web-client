import { animate, AnimationTriggerMetadata, group, query, sequence, style, transition, trigger } from '@angular/animations';

export function faqDialogAppearanceAnimation(
): AnimationTriggerMetadata {
  return trigger('faqDialogAppearance', [
    transition(':enter', [
      query('.blur-filter', style({ 'backdrop-filter': 'blur(0)' })),
      query('.white-filter', style({ opacity: 0 })),
      query('.dialog-animation-container', style({ 'max-height': 0 })),
      query('.dialog', style({ opacity: 0 })),
      sequence([
        group([
          query('.white-filter', [
            animate('.3s ease-out', style({ opacity: '*' })),
          ]),
          query('.blur-filter', [
            animate('.3s ease-out', style({ 'backdrop-filter': '*' })),
          ]),
        ]),
        query('.dialog-animation-container', animate('.4s ease-out', style({
          'max-height': '*',
        }))),
        query('.dialog', animate('.3s ease-out', style({
          opacity: '*',
        }))),
      ]),
    ]),
    transition(':leave', [
      sequence([
        query('.dialog', animate('.3s ease-out', style({
          opacity: 0,
        }))),
        query('.dialog-animation-container', animate('.4s ease-out', style({
          'max-height': 0,
        }))),
        group([
          query('.white-filter', [
            animate('.4s ease-out', style({ opacity: 0 })),
          ]),
          query('.blur-filter', [
            animate('.4s ease-out', style({ 'backdrop-filter': 'blur(0)' })),
          ]),
        ]),
      ]),
    ]),
  ]);
}
