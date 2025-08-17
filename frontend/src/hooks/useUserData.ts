import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  timezone?: string;
  language?: string;
}

export function useUserData() {
  const [user, setUser] = useState<User | null>(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    const handleUserDataUpdate = (event: CustomEvent) => {
      setUser(event.detail);
    };

    // Listen for user data updates from API calls
    window.addEventListener(
      'userDataUpdated',
      handleUserDataUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        'userDataUpdated',
        handleUserDataUpdate as EventListener
      );
    };
  }, []);

  return user;
}
