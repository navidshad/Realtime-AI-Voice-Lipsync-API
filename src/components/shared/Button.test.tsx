import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button', () => {
  test('renders with correct text', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies custom className correctly', () => {
    render(
      <Button onClick={() => {}} className="custom-class">
        Click me
      </Button>
    );
    
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('bg-blue-500'); // Default class
  });
}); 