import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/Button';
import { describe, expect, it, vi } from 'vitest';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button button--variant--primary button--size--m');
  });

  it('renders with different variants', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button', { name: 'Danger' });

    expect(button).toHaveClass('button button--variant--danger button--size--m');
  });

  it('renders with different sizes', () => {
    render(<Button size={ButtonSize.LARGE}>Large Button</Button>);
    const button = screen.getByRole('button', { name: 'Large Button' });

    expect(button).toHaveClass('button button--variant--primary button--size--l');
  });

  it('applies disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: 'Disabled' });

    expect(button).toBeDisabled();
    expect(button).toHaveClass('button button--variant--primary button--size--m button--disabled');
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders text element with correct BEM class', () => {
    render(<Button>Button text</Button>);
    const textElement = screen.getByText('Button text');

    expect(textElement).toHaveClass('button__text');
  });

  it('applies correct button type', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button', { name: 'Submit' });

    expect(button).toHaveAttribute('type', 'submit');
  });
});
