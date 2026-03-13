import { render, screen } from '@testing-library/react';
import LandingPage from '../LandingPage';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock components that might be complex or use specific hooks
vi.mock('../../components/landing/LandingHero', () => ({
  LandingHero: () => <div data-testid="landing-hero">Hero Section</div>,
}));

vi.mock('../../components/landing/LandingHowItWorks', () => ({
  LandingHowItWorks: () => <div data-testid="landing-how">How it Works</div>,
}));

vi.mock('../../components/landing/LandingTech', () => ({
  LandingTech: () => <div data-testid="landing-tech">Tech Section</div>,
}));

vi.mock('../../components/landing/LandingFooter', () => ({
  LandingFooter: () => <div data-testid="landing-footer">Footer</div>,
}));

describe('LandingPage', () => {
  it('renders all landing sections', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('landing-hero')).toBeInTheDocument();
    expect(screen.getByTestId('landing-how')).toBeInTheDocument();
    expect(screen.getByTestId('landing-tech')).toBeInTheDocument();
    expect(screen.getByTestId('landing-footer')).toBeInTheDocument();
  });
});
