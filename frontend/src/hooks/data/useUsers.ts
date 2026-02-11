export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const USERS: User[] = [
  { id: '1', name: 'Christopher Pallo', email: 'christopher@sofkianos.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Christopher&backgroundColor=b6e3f4' },
  { id: '2', name: 'Santiago', email: 'santiago@sofkianos.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Santiago&backgroundColor=c0aede' },
  { id: '3', name: 'Backend Team', email: 'backend@sofkianos.com', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Backend&backgroundColor=d1d4f9' },
  { id: '4', name: 'Frontend Team', email: 'frontend@sofkianos.com', avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Frontend&backgroundColor=ffd5dc' },
];

/**
 * Hook to manage users data.
 * Currently returns a static list, but prepared for API integration.
 */
export const useUsers = () => {
  return {
    USERS,
  };
};
