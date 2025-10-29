// Footer component types and interfaces

import type { NavItem } from "../NavMenu/NavMenu";

export interface FooterLink {
  to?: string;
  href?: string;
  label: string;
  icon?: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterProps {
  // Currently no props needed, but keeping for future extensibility
}

// NavMenu integration types
export interface FooterNavSection {
  title: string;
  items: NavItem;
  activeId: string;
}
