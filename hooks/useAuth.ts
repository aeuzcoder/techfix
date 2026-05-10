import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth.store';
import { apiClient } from '@/lib/api-client';

export function useAuth() {
  const { setFirebaseUser, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        try {
          const token = await user.getIdToken();
          // Set in apiClient or cookies if needed
          
          const dbUser = await apiClient.verifyAuth(token);
          if (dbUser) {
            setUser(dbUser);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Auth verification failed", error);
          logout();
        }
      } else {
        logout();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setFirebaseUser, setUser, setLoading, logout]);
}
