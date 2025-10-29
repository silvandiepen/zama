export const Size = {
  SMALL:'small',
  MEDIUM: 'medium',
  LARGE: 'large'
}
type Size = typeof Size[keyof typeof Size];

export const Position = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left'
}
type Position = typeof Position[keyof typeof Position];
