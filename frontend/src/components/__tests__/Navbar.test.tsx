import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../Navbar';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../store/appStore';
import { MemoryRouter } from 'react-router-dom';

// Mock the store
vi.mock('../../store/appStore', () => ({
  useAppStore: vi.fn(),
}));

const mockToggleAppView = vi.fn();

describe('Navbar', () => {
  it('renders the logo', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Sofkian')).toBeInTheDocument();
    expect(screen.getByText('OS')).toBeInTheDocument();
  });

  it('shows landing navigation links when not in app view', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Cómo funciona')).toBeInTheDocument();
    expect(screen.getByText('Tecnología')).toBeInTheDocument();
    expect(screen.getByText('Acceder')).toBeInTheDocument();
  });

  it('shows only "Volver" when in app view', () => {
    render(
      <MemoryRouter initialEntries={['/kudos']}>
        <Navbar />
      </MemoryRouter>
    );
    
    expect(screen.queryByText('Cómo funciona')).not.toBeInTheDocument();
    expect(screen.getByText('Volver')).toBeInTheDocument();
  });
});

