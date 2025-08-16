import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import { authApi } from '../services/saasApi';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  subscription_plan: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  token: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  signup: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    organization_name: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      const storedOrg = localStorage.getItem('organization');

      if (storedToken && storedUser && storedOrg) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setOrganization(JSON.parse(storedOrg));
        } catch (error) {
          console.error('Error parsing stored auth data:', error);
          clearAuth();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const clearAuth = () => {
    setUser(null);
    setOrganization(null);
    setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('organization');
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authApi.login(email, password);

      if (response.success) {
        const {
          access_token,
          user: userData,
          organization: orgData,
        } = response.data;

        setToken(access_token);
        setUser(userData);
        setOrganization(orgData);

        // Store in localStorage as backup (will be migrated to secure storage later)
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('organization', JSON.stringify(orgData));

        return { success: true };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  };

  const signup = async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    organization_name: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authApi.signup(data);

      if (response.success) {
        const {
          access_token,
          user: userData,
          organization: orgData,
        } = response.data;

        setToken(access_token);
        setUser(userData);
        setOrganization(orgData);

        // Store in localStorage as backup (will be migrated to secure storage later)
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('organization', JSON.stringify(orgData));

        return { success: true };
      } else {
        return { success: false, message: response.message || 'Signup failed' };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Signup failed',
      };
    }
  };

  const logout = () => {
    clearAuth();
  };

  const value: AuthContextType = useMemo(
    () => ({
      user,
      organization,
      token,
      login,
      signup,
      logout,
      isLoading,
      isAuthenticated: !!user && !!token,
    }),
    [user, organization, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
