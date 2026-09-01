import { createContext, useContext, useState, type ReactNode } from "react";
import { type User, type UserRole, mockUsers } from "../data/mockUsers";

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("duryog-user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (role: UserRole) => {
    const found = mockUsers.find((u) => u.role === role) ?? mockUsers[0];
    setUser(found);
    sessionStorage.setItem("duryog-user", JSON.stringify(found));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("duryog-user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
