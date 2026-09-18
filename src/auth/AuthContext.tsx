import { createContext, useContext, useState, type ReactNode } from 'react';

// Hardcoded admin credentials (no backend auth exists yet for this project).
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'showza@admin123';

const STORAGE_KEY = 'showza_admin_authed';

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem(STORAGE_KEY) === 'true'
  );

  const login = (username: string, password: string) => {
    const ok = username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    if (ok) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
    }
    return ok;
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
