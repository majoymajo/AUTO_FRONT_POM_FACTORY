import { useState, useEffect, useMemo } from 'react';
import { USERS } from '../data/useUsers';
import type { User } from '../data/useUsers';


/**
 * Hook to manage selected user avatar preview and loading state.
 */
export const useAvatarPreview = (selectedEmail: string) => {
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const toUser = useMemo(() => 
    USERS.find((u: User) => u.email === selectedEmail),
    [selectedEmail]
  );

  useEffect(() => {
    if (!toUser) {
      setLoadingAvatar(false);
      return;
    }
    
    setLoadingAvatar(true);
    const t = setTimeout(() => setLoadingAvatar(false), 800);
    return () => clearTimeout(t);
  }, [selectedEmail, toUser]);

  return {
    toUser,
    loadingAvatar,
  };
};
