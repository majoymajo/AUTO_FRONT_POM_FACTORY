import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Hero } from './Hero';

describe('Hero Component', () => {
  it('renders the title correctly', () => {
    render(<Hero title="Hello Kudas" />);
    expect(screen.getByText('Hello Kudas')).toBeInTheDocument();
  });

  it('renders the subtitle when provided', () => {
    render(<Hero title="Title" subtitle="This is a subtitle" />);
    expect(screen.getByText('This is a subtitle')).toBeInTheDocument();
  });

  it('contains the branding badge', () => {
    render(<Hero title="Test" />);
    expect(screen.getByText(/Sofkianos MVP/i)).toBeInTheDocument();
  });
});
