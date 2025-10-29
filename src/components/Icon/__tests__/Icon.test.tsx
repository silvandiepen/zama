import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Icon } from '../index';
import type { IconProps } from '../model';

// Mock the open-icon library
const mockGetIcon = vi.fn();
vi.mock('open-icon', () => ({
  getIcon: mockGetIcon,
  Icons: {
    CHEVRON_DOWN: 'chevron-down',
    USER: 'user',
    SETTINGS: 'settings',
    STAR: 'star',
  },
}));

// Mock bemm utility
vi.mock('@/utils/bemm', () => ({
  useBemm: () => (className: string) => className,
}));

describe('Icon Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetIcon.mockResolvedValue('<svg><path d="test"/></svg>');
  });

  describe('Rendering', () => {
    it('should render icon container', async () => {
      render(<Icon name="user" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toBeInTheDocument();
      });
    });

    it('should render with default medium size', async () => {
      render(<Icon name="user" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toHaveClass('medium');
      });
    });

    it('should render with specified size', async () => {
      render(<Icon name="user" size="large" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toHaveClass('large');
      });
    });

    it('should render with custom className', async () => {
      render(<Icon name="user" className="custom-class" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toHaveClass('custom-class');
      });
    });

    it('should render brand icon for github', async () => {
      render(<Icon name="github" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('is-brand');
      });
    });

    it('should render brand icon for google', async () => {
      render(<Icon name="google" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('is-brand');
      });
    });
  });

  describe('Icon Mapping', () => {
    it('should map common icon names correctly', async () => {
      render(<Icon name="chevron-down" />);
      
      await waitFor(() => {
        expect(mockGetIcon).toHaveBeenCalledWith('chevron-down');
      });
    });

    it('should use icon name directly if not in mapping', async () => {
      render(<Icon name="custom-icon" />);
      
      await waitFor(() => {
        expect(mockGetIcon).toHaveBeenCalledWith('custom-icon');
      });
    });

    it('should handle play icon mapping', async () => {
      render(<Icon name="play" />);
      
      await waitFor(() => {
        expect(mockGetIcon).toHaveBeenCalledWith(mockIcons.PLAYBACK_PLAY);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have aria-hidden when no ariaLabel provided', async () => {
      render(<Icon name="user" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('should have aria-label when provided', async () => {
      render(<Icon name="menu" ariaLabel="Open navigation menu" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toHaveAttribute('aria-label', 'Open navigation menu');
        expect(icon).not.toHaveAttribute('aria-hidden');
      });
    });

    it('should have role="img" for accessibility', async () => {
      render(<Icon name="user" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state initially', () => {
      mockGetIcon.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<Icon name="user" />);
      
      // Should render a span without SVG content initially
      const icon = screen.getByRole('img');
      expect(icon).toBeInTheDocument();
      expect(icon.querySelector('svg')).not.toBeInTheDocument();
    });

    it('should render SVG after loading', async () => {
      render(<Icon name="user" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing icon gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockGetIcon.mockRejectedValue(new Error('Icon not found'));
      
      render(<Icon name="nonexistent" />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Icon "nonexistent" not found', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });

    it('should handle empty name gracefully', async () => {
      render(<Icon name="" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toBeInTheDocument();
        expect(icon.querySelector('svg')).not.toBeInTheDocument();
      });
    });

    it('should warn when icon key not found in Icons object', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      render(<Icon name="unknown-icon" />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Icon "unknown-icon" not found');
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Color Classes', () => {
    it('should apply color class when color is provided', async () => {
      render(<Icon name="user" color="red" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toHaveClass('color-red');
      });
    });

    it('should not apply color class when color is not provided', async () => {
      render(<Icon name="user" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).not.toHaveClass(/color-/);
      });
    });
  });

  describe('SVG Content', () => {
    it('should render SVG content for open-icon', async () => {
      const mockSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>';
      mockGetIcon.mockResolvedValue(mockSvg);
      
      render(<Icon name="shield" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        const svg = icon.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      });
    });

    it('should render brand SVG content directly', async () => {
      render(<Icon name="github" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        const svg = icon.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
      });
    });
  });

  describe('Component Updates', () => {
    it('should update icon when name changes', async () => {
      const { rerender } = render(<Icon name="user" />);
      
      await waitFor(() => {
        expect(mockGetIcon).toHaveBeenCalledWith('user');
      });
      
      rerender(<Icon name="settings" />);
      
      await waitFor(() => {
        expect(mockGetIcon).toHaveBeenCalledWith('settings');
      });
    });

    it('should update size when size prop changes', async () => {
      const { rerender } = render(<Icon name="user" size="small" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toHaveClass('small');
      });
      
      rerender(<Icon name="user" size="large" />);
      
      await waitFor(() => {
        const icon = screen.getByRole('img');
        expect(icon).toHaveClass('large');
      });
    });
  });
});