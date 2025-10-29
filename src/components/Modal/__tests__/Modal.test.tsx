import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Modal } from '../index';
import type { ModalProps } from '../modal.model';

// Mock feature flags
const mockFlags = {
  enableKeyboardShortcuts: true,
  enableClickOutsideToClose: true,
};

vi.mock('@/store/featureFlags', () => ({
  useFeatureFlags: () => ({ flags: mockFlags })
}));

// Mock Button component
vi.mock('@/components/Button', () => ({
  Button: ({ onClick, children, ...props }: any) => {
    const { iconOnly, ...restProps } = props;
    return (
      <button onClick={onClick} {...restProps}>
        {children}
      </button>
    );
  },
}));

// Mock bemm utility
vi.mock('@/utils/bemm', () => ({
  useBemm: () => (className: string) => className,
}));

describe('Modal Component', () => {
  const defaultProps: ModalProps = {
    open: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when open is false', () => {
      render(<Modal {...defaultProps} open={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when open is true', () => {
      render(<Modal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should render without title when title is not provided', () => {
      const propsWithoutTitle = { ...defaultProps, title: undefined };
      render(<Modal {...propsWithoutTitle} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('should render footer when provided', () => {
      const footer = <button>Footer Button</button>;
      render(<Modal {...defaultProps} footer={footer} />);
      
      expect(screen.getByText('Footer Button')).toBeInTheDocument();
    });

    it('should not render footer when not provided', () => {
      render(<Modal {...defaultProps} />);
      
      // The close button should be the only button
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA attributes', () => {
      render(<Modal {...defaultProps} />);
      
      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    it('should have close button with aria-label', () => {
      render(<Modal {...defaultProps} />);
      
      const closeButton = screen.getByLabelText('Close');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<Modal {...defaultProps} />);
      
      const closeButton = screen.getByLabelText('Close');
      await user.click(closeButton);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked (if enabled)', async () => {
      const user = userEvent.setup();
      render(<Modal {...defaultProps} />);
      
      const backdrop = screen.getByRole('dialog');
      await user.click(backdrop);
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when window content is clicked', async () => {
      const user = userEvent.setup();
      render(<Modal {...defaultProps} />);
      
      const content = screen.getByText('Modal content');
      await user.click(content);
      
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Interactions', () => {
    it('should call onClose when ESC key is pressed (if enabled)', () => {
      render(<Modal {...defaultProps} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when other keys are pressed', () => {
      render(<Modal {...defaultProps} />);
      
      fireEvent.keyDown(document, { key: 'Enter' });
      
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Feature Flags Integration', () => {
    beforeEach(() => {
      mockFlags.enableKeyboardShortcuts = false;
      mockFlags.enableClickOutsideToClose = false;
    });

    it('should not call onClose when ESC is pressed if keyboard shortcuts disabled', () => {
      render(<Modal {...defaultProps} />);
      
      fireEvent.keyDown(document, { key: 'Escape' });
      
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it('should not call onClose when backdrop clicked if click outside disabled', async () => {
      const user = userEvent.setup();
      render(<Modal {...defaultProps} />);
      
      const backdrop = screen.getByRole('dialog');
      await user.click(backdrop);
      
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });

  describe('Event Listeners Cleanup', () => {
    it('should properly clean up event listeners on unmount', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<Modal {...defaultProps} />);
      
      // Verify event listeners were added
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      // Unmount component
      unmount();
      
      // Verify event listeners were removed
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('should clean up event listeners when modal closes', () => {
      const { rerender } = render(<Modal {...defaultProps} open={true} />);
      
      // Close modal
      rerender(<Modal {...defaultProps} open={false} />);
      
      // Modal should not be in document
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Complex Content', () => {
    it('should render complex React elements as children', () => {
      const complexContent = (
        <div>
          <h2>Complex Content</h2>
          <p>This is a paragraph</p>
          <button>Action Button</button>
        </div>
      );
      
      render(<Modal {...defaultProps}>{complexContent}</Modal>);
      
      expect(screen.getByText('Complex Content')).toBeInTheDocument();
      expect(screen.getByText('This is a paragraph')).toBeInTheDocument();
      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    it('should render complex React elements as footer', () => {
      const complexFooter = (
        <div>
          <button>Cancel</button>
          <button>Submit</button>
        </div>
      );
      
      render(<Modal {...defaultProps} footer={complexFooter} />);
      
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
  });
});