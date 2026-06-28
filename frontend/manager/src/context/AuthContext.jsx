import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, setToken, removeToken, decodeToken } from '../utils/jwtUtils';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        // Double check if the user has the manager role
        if (decoded.role === 'EVENT_MANAGER') {
          setUser(decoded);
        } else {
          removeToken();
        }
      } else {
        removeToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const decoded = decodeToken(data.token);
    if (decoded && decoded.role === 'EVENT_MANAGER') {
      setToken(data.token);
      setUser(decoded);
      return decoded;
    } else {
      throw new Error('Access denied. Event Manager privileges required.');
    }
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    const decoded = decodeToken(data.token);
    setToken(data.token);
    setUser(decoded);
    return decoded;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
