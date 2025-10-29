import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { TextInput, PasswordInput, Textarea, Checkbox, SwitchButton } from '../index';
import type { SwitchOption } from '../index';

// Mock bemm utility
vi.mock('@/utils/bemm', () => ({
  useBemm: () => (element: string, modifiers?: any) => {
    const baseClass = `field${element ? '__' + element : ''}`;
    if (modifiers?.error) return `${baseClass} field--error`;
    if (modifiers?.active) return `${baseClass} active`;
    return baseClass;
  },
}));

// Mock Icon component
vi.mock('@/components/Icon', () => ({
  Icon: ({ name }: { name: string }) => <div data-testid={`icon-${name}`} />,
}));

describe('Input Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TextInput', () => {
    it('should render with label', () => {
      render(<TextInput id="test" label="Test Input" />);
      
      expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
      expect(screen.getByText('Test Input')).toBeInTheDocument();
    });

    it('should render with help text', () => {
      render(<TextInput id="test" label="Test Input" help="This is help text" />);
      
      expect(screen.getByText('This is help text')).toBeInTheDocument();
    });

    it('should render with error message', () => {
      render(<TextInput id="test" label="Test Input" error="This is an error" />);
      
      expect(screen.getByText('This is an error')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should handle input changes', async () => {
      const user = userEvent.setup();
      render(<TextInput id="test" label="Test Input" />);
      
      const input = screen.getByLabelText('Test Input');
      await user.type(input, 'Hello World');
      
      expect(input).toHaveValue('Hello World');
    });

    it('should apply custom props', () => {
      render(<TextInput id="test" label="Test Input" placeholder="Enter text..." />);
      
      const input = screen.getByLabelText('Test Input');
      expect(input).toHaveAttribute('placeholder', 'Enter text...');
    });
  });

  describe('PasswordInput', () => {
    it('should render as password type', () => {
      render(<PasswordInput id="password" label="Password" />);
      
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should handle input changes', async () => {
      const user = userEvent.setup();
      render(<PasswordInput id="password" label="Password" />);
      
      const input = screen.getByLabelText('Password');
      await user.type(input, 'secret123');
      
      expect(input).toHaveValue('secret123');
    });
  });

  describe('Textarea', () => {
    it('should render with label', () => {
      render(<Textarea id="message" label="Message" />);
      
      expect(screen.getByLabelText('Message')).toBeInTheDocument();
    });

    it('should render with custom rows', () => {
      render(<Textarea id="message" label="Message" rows={5} />);
      
      const textarea = screen.getByLabelText('Message');
      expect(textarea).toHaveAttribute('rows', '5');
    });

    it('should handle text changes', async () => {
      const user = userEvent.setup();
      render(<Textarea id="message" label="Message" />);
      
      const textarea = screen.getByLabelText('Message');
      await user.type(textarea, 'Hello World');
      
      expect(textarea).toHaveValue('Hello World');
    });
  });

  describe('Checkbox', () => {
    it('should render with label', () => {
      render(<Checkbox id="agree" label="I agree" />);
      
      expect(screen.getByLabelText('I agree')).toBeInTheDocument();
    });

    it('should be unchecked by default', () => {
      render(<Checkbox id="agree" label="I agree" />);
      
      const checkbox = screen.getByLabelText('I agree');
      expect(checkbox).not.toBeChecked();
    });

    it('should handle checked state', () => {
      render(<Checkbox id="agree" label="I agree" checked readOnly />);
      
      const checkbox = screen.getByLabelText('I agree');
      expect(checkbox).toBeChecked();
    });

    it('should handle toggle interaction', async () => {
      const user = userEvent.setup();
      render(<Checkbox id="agree" label="I agree" />);
      
      const checkbox = screen.getByLabelText('I agree');
      await user.click(checkbox);
      
      expect(checkbox).toBeChecked();
    });
  });

  describe('SwitchButton', () => {
    const options: SwitchOption<'monthly' | 'yearly'>[] = [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' }
    ];

    it('should render with options', () => {
      render(
        <SwitchButton
          id="plan"
          label="Billing Plan"
          value="monthly"
          options={options}
          onChange={vi.fn()}
        />
      );
      
      expect(screen.getByText('Monthly')).toBeInTheDocument();
      expect(screen.getByText('Yearly')).toBeInTheDocument();
      expect(screen.getByText('Billing Plan')).toBeInTheDocument();
    });

    it('should mark selected option as active', () => {
      render(
        <SwitchButton
          id="plan"
          label="Billing Plan"
          value="monthly"
          options={options}
          onChange={vi.fn()}
        />
      );
      
      const monthlyButton = screen.getByText('Monthly');
      const yearlyButton = screen.getByText('Yearly');
      
      expect(monthlyButton.closest('button')).toHaveAttribute('aria-selected', 'true');
      expect(yearlyButton.closest('button')).toHaveAttribute('aria-selected', 'false');
    });

    it('should handle option selection', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      
      render(
        <SwitchButton
          id="plan"
          label="Billing Plan"
          value="monthly"
          options={options}
          onChange={handleChange}
        />
      );
      
      const yearlyButton = screen.getByText('Yearly');
      await user.click(yearlyButton);
      
      expect(handleChange).toHaveBeenCalledWith('yearly');
    });

    it('should render with icons', () => {
      const optionsWithIcons: SwitchOption<'light' | 'dark'>[] = [
        { value: 'light', label: 'Light', icon: 'sun' },
        { value: 'dark', label: 'Dark', icon: 'moon' }
      ];

      render(
        <SwitchButton
          id="theme"
          label="Theme"
          value="light"
          options={optionsWithIcons}
          onChange={vi.fn()}
        />
      );
      
      expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
      expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <SwitchButton
          id="plan"
          label="Billing Plan"
          value="monthly"
          options={options}
          onChange={vi.fn()}
          disabled
        />
      );
      
      const buttons = screen.getAllByRole('tab');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('should not call onChange when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      
      render(
        <SwitchButton
          id="plan"
          label="Billing Plan"
          value="monthly"
          options={options}
          onChange={handleChange}
          disabled
        />
      );
      
      const yearlyButton = screen.getByText('Yearly');
      await user.click(yearlyButton);
      
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Error States', () => {
    it('should apply error class when error is provided', () => {
      render(<TextInput id="test" label="Test" error="Error message" />);
      
      const errorMessage = screen.getByText('Error message');
      const fieldContainer = errorMessage.closest('.field');
      expect(fieldContainer).toHaveClass('field--error');
    });

    it('should display error message with role="alert"', () => {
      render(<TextInput id="test" label="Test" error="Error message" />);
      
      const errorElement = screen.getByRole('alert');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent('Error message');
    });
  });

  describe('Accessibility', () => {
    it('should associate label with input using htmlFor', () => {
      render(<TextInput id="test-input" label="Test Input" />);
      
      const label = screen.getByText('Test Input');
      expect(label).toHaveAttribute('for', 'test-input');
      
      const input = screen.getByLabelText('Test Input');
      expect(input).toHaveAttribute('id', 'test-input');
    });

    it('should have proper ARIA attributes for switch button', () => {
      const testOptions: SwitchOption<'monthly' | 'yearly'>[] = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' }
      ];
      
      render(
        <SwitchButton
          id="plan"
          label="Billing Plan"
          value="monthly"
          options={testOptions}
          onChange={vi.fn()}
        />
      );
      
      const switchContainer = screen.getByRole('tablist');
      expect(switchContainer).toHaveAttribute('aria-label', 'Billing Plan');
      
      const buttons = screen.getAllByRole('tab');
      expect(buttons[0]).toHaveAttribute('aria-selected', 'true');
      expect(buttons[1]).toHaveAttribute('aria-selected', 'false');
    });
  });
});