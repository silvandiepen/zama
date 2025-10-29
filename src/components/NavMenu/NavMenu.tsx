import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useBemm } from '@/utils/bemm';
import './NavMenu.scss';

export type NavItem = {
  id: string;
  label: string;
  to?: string; // optional route
};

type Props = {
  items: NavItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  ariaLabel?: string;
};

export const NavMenu: React.FC<Props> = ({
  items,
  activeId,
  onSelect,
  orientation = 'vertical',
  className,
  ariaLabel,
}) => {
  const bemm = useBemm('navmenu');
  const navRef = useRef<HTMLElement>(null);
  const activeHighlightRef = useRef<HTMLSpanElement>(null);
  const hoverHighlightRef = useRef<HTMLSpanElement>(null);

  // JavaScript fallback for browsers where anchor positioning polyfill isn't working
  useEffect(() => {
    const nav = navRef.current;
    const activeHighlight = activeHighlightRef.current;
    const hoverHighlight = hoverHighlightRef.current;
    
    if (!nav || !activeHighlight || !hoverHighlight) return;

    // Check if anchor positioning is working
    const supportsAnchorPositioning = CSS.supports('top', 'anchor(--a top)');
    
    if (supportsAnchorPositioning) {
      // Native support or polyfill is working - let CSS handle it
      return;
    }

    // JavaScript fallback
    const updateHighlights = () => {
      const activeItem = nav.querySelector(`[data-anchor-id="${activeId}"]`) as HTMLElement;
      if (activeItem && activeHighlight) {
        const rect = activeItem.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        
        activeHighlight.style.setProperty('--h-top', `${rect.top - navRect.top}px`);
        activeHighlight.style.setProperty('--h-left', `${rect.left - navRect.left}px`);
        activeHighlight.style.setProperty('--h-width', `${rect.width}px`);
        activeHighlight.style.setProperty('--h-height', `${rect.height}px`);
        activeHighlight.style.setProperty('--h-opacity', '1');
      }
    };

    // Handle hover
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches('[data-anchor-id]') && hoverHighlight) {
        const rect = target.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        
        hoverHighlight.style.setProperty('--h-top', `${rect.top - navRect.top}px`);
        hoverHighlight.style.setProperty('--h-left', `${rect.left - navRect.left}px`);
        hoverHighlight.style.setProperty('--h-width', `${rect.width}px`);
        hoverHighlight.style.setProperty('--h-height', `${rect.height}px`);
        hoverHighlight.style.setProperty('--h-opacity', '1');
      }
    };

    const handleMouseLeave = () => {
      if (hoverHighlight) {
        hoverHighlight.style.setProperty('--h-opacity', '0');
      }
    };

    // Initial update
    updateHighlights();

    // Add event listeners
    nav.addEventListener('mouseenter', handleMouseEnter, true);
    nav.addEventListener('mouseleave', handleMouseLeave, true);

    // Update on resize
    const resizeObserver = new ResizeObserver(updateHighlights);
    resizeObserver.observe(nav);

    return () => {
      nav.removeEventListener('mouseenter', handleMouseEnter, true);
      nav.removeEventListener('mouseleave', handleMouseLeave, true);
      resizeObserver.disconnect();
    };
  }, [items, activeId, orientation]);

  return (
    <nav
      ref={navRef}
      className={[bemm('', orientation), className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
      {/* highlight layers driven by CSS anchors in nav-menu.scss */}
      <span ref={activeHighlightRef} className={bemm('highlight', 'active')} aria-hidden />
      <span ref={hoverHighlightRef} className={bemm('highlight', 'hover')} aria-hidden />
      {items.map((item) => {
        const isActive = item.id === activeId;
        const commonProps = {
          className: bemm('item', { active: isActive }),
          'aria-current': isActive ? ('page' as const) : undefined,
          'data-anchor-id': item.id,
          onMouseEnter: () => {
            // CSS handles hover anchor via :hover; no JS needed here
          },
        };
        if (item.to) {
          return (
            <Link key={item.id} to={item.to} {...commonProps}>
              {item.label}
            </Link>
          );
        }
        return (
          <button
            key={item.id}
            type="button"
            {...commonProps}
            onClick={() => onSelect?.(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};
