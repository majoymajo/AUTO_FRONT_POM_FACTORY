import { vi } from 'vitest';

export const mockUsers = [
  { id: '1', name: 'Santiago Arias', email: 'santiago@sofkianos.com', avatar: 'https://i.pravatar.cc/150?u=santiago' },
  { id: '2', name: 'Christopher Pallo', email: 'christopher@sofkianos.com', avatar: 'https://i.pravatar.cc/150?u=christopher' },
];

export const mockKudosService = {
  getUsers: vi.fn().mockResolvedValue(mockUsers),
  sendKudo: vi.fn().mockResolvedValue({ status: 201, data: { success: true } }),
};

vi.mock('../../../services/api/kudosService', () => ({
  kudosService: mockKudosService,
}));
