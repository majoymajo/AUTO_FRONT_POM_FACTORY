import { vi } from 'vitest';

export const mockAppStore = {
  isAppView: false,
  toggleAppView: vi.fn(),
  setAppView: vi.fn(),
};

vi.mock('../../../store/appStore', () => ({
  useAppStore: (selector: any) => selector(mockAppStore),
}));

export const mockUserStore = {
  users: [],
  loading: false,
  error: null,
  fetchUsers: vi.fn(),
  getUserByEmail: vi.fn(),
};

vi.mock('../../../store/userStore', () => ({
  useUserStore: (selector: any) => selector(mockUserStore),
}));
