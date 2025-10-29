# Styling Architecture

## BEM Methodology

We use BEM (Block, Element, Modifier) methodology for maintainable CSS:

```
.block { }                   // Block
.block__element { }          // Element
.block--modifier { }         // Modifier
.block__element--modifier { } // Modified Element
```

## Design Tokens

CSS Custom Properties provide a consistent design system. Key tokens:

```
:root {
  /* Color tokens generated for each base + semantic color */
  --color-primary; --color-primary-text; --color-primary-dark; /* ... */
  --color-secondary; --color-secondary-text; /* ... */
  --color-success; --color-error; --color-warning; --color-info;

  /* Theme */
  --color-background;
  --color-foreground;
  --color-surface-primary; /* main surface */
  --color-border-primary;  /* subtle borders */

  /* Typography */
  --font-family-display; --font-family-sans; --font-family-mono;
  --font-size-xs; --font-size-s; --font-size; --font-size-l; --font-size-xl; --font-size-xxl;
  --font-weight-medium; --font-weight-semibold; --font-weight-bold;

  /* Spacing */
  --spacing; /* section spacing */
  --space-xs; --space-s; --space; --space-m; --space-l; --space-xl;

  /* Radius */
  --border-radius-xs; --border-radius-s; --border-radius; --border-radius-m; --border-radius-l; --border-radius-xl;

  /* Motion */
  --bezier;
}
```

## Component Styling Pattern

Each component follows a consistent styling pattern:

- Component-specific SCSS file
- BEM class naming with utility
- CSS custom properties for theming
- Responsive design with mobile-first approach
- Accessibility considerations (focus states, contrast)

## Theme System

Dynamic theming is achieved through CSS custom properties:

```
[data-theme="dark"] {
  --color-background: var(--color-dark);
  --color-foreground: var(--color-light);
}

[data-theme="light"] {
  --color-background: var(--color-light);
  --color-foreground: var(--color-dark);
}
```

## Responsive Design

Mobile-first responsive design with CSS Grid and Flexbox:

- CSS Grid for layout structures
- Flexbox for component alignment
- Container queries for component-level responsiveness
- Logical properties for internationalization support
