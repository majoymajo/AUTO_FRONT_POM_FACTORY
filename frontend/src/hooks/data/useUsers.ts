import { useUserStore } from '../../store/userStore';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

// Deprecated constant, now in userStore
export const USERS: User[] = []; 

/**
 * Hook to manage users data via global store.
 */
export const useUsers = () => {
  const users = useUserStore((state) => state.users);

  return {
    USERS: users,
  };
};
