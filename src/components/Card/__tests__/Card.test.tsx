import { render, screen } from '@testing-library/react';
import { Card } from '@/components/Card';

describe('Card', () => {
  it('renders with basic content', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    
    expect(screen.getByText('Card content')).toBeInTheDocument();
    expect(screen.getByRole('generic')).toHaveClass('card');
  });

  it('renders with title', () => {
    render(
      <Card title="Card Title">
        <p>Card content</p>
      </Card>
    );
    
    const title = screen.getByRole('heading', { name: 'Card Title' });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('card__title');
    
    const header = title.parentElement;
    expect(header).toHaveClass('card__header');
  });

  it('renders with footer', () => {
    render(
      <Card footer={<button>Action</button>}>
        <p>Card content</p>
      </Card>
    );
    
    const footer = screen.getByRole('button', { name: 'Action' });
    expect(footer).toBeInTheDocument();
    expect(footer.parentElement).toHaveClass('card__footer');
  });

  it('renders with title, content, and footer', () => {
    render(
      <Card title="Title" footer={<button>Action</button>}>
        <p>Content</p>
      </Card>
    );
    
    expect(screen.getByRole('heading', { name: 'Title' })).toHaveClass('card__title');
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    
    const card = screen.getByRole('generic');
    expect(card).toHaveClass('card');
    
    const content = screen.getByText('Content').parentElement;
    expect(content).toHaveClass('card__content');
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-class">
        <p>Content</p>
      </Card>
    );
    
    const card = screen.getByRole('generic');
    expect(card).toHaveClass('card custom-class');
  });

  it('does not render header when no title provided', () => {
    render(
      <Card>
        <p>Content</p>
      </Card>
    );
    
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByClassName('card__header')).not.toBeInTheDocument();
  });

  it('does not render footer when no footer provided', () => {
    render(
      <Card>
        <p>Content</p>
      </Card>
    );
    
    expect(screen.queryByClassName('card__footer')).not.toBeInTheDocument();
  });
});