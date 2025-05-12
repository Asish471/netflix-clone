// src/contexts/authContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const client = useApolloClient();

  // Check auth status on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    console.log("token inside login",token);
    
    setIsAuthenticated(true);
    await client.resetStore();
    
  };



  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    client.resetStore();
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}