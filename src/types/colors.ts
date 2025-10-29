export const TokenColors = {
  PRIMARY: 'primary',
  SECONDARY:'secondary',
  TERTIARY: 'tertiary',
  QUATERNARY: 'quaternary',
  DARK:'dark',
  LIGHT:'light',
  INFO:'info',
  SUCCESS:'success',
  DANGER: 'danger',
  ERROR:'error',
  WARNING:'warning'
} as const;
export type TokenColors = typeof TokenColors[keyof typeof TokenColors];


export const BaseColors = {
  RED:'red',
  GREEN:'green',
  BLUE:'blue',
  BABY_BLUE:'baby-blue',
  YELLOW: 'yellow',
  ORANGE:'orange',
  PURPLE:'purple',
  MAGENTA:'magenta',
  BROWN:'brown',
  TURQUOISE: 'turquoise',
  BLACK:'black',
  WHITE:'white',
} as const;
export type BaseColors = typeof BaseColors[keyof typeof BaseColors];

export const Colors = {
  ...BaseColors,
  ...TokenColors
} as const;
export type Color = typeof Colors[keyof typeof Colors];
