import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiClient } from "../lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  profile_image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const USER_KEY = "duryog-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage and verify with server
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to restore from localStorage
        const stored = localStorage.getItem(USER_KEY);
        if (stored && apiClient.isAuthenticated()) {
          const parsedUser = JSON.parse(stored);
          setUser(parsedUser);
          
          // Verify with server
          try {
            const freshUser = await apiClient.getMe();
            setUser(freshUser);
            localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
          } catch (err) {
            // Token is invalid, clear auth
            apiClient.clearAuth();
            setUser(null);
            setError("Session expired. Please login again.");
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize auth");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.login(email, password);
      setUser(result.user);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.register(input);
      setUser(result.user);
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await apiClient.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
