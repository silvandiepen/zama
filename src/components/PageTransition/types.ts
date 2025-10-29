export const TRANSITIONS = {
  FADE: 'fade',
  SLIDE_UP: 'slide-up',
  SLIDE_DOWN: 'slide-down',
  SLIDE_LEFT: 'slide-left',
  SLIDE_RIGHT: 'slide-right',
  SCALE: 'scale',
  FLIP: 'flip'
} as const;

export type TransitionType = typeof TRANSITIONS[keyof typeof TRANSITIONS];