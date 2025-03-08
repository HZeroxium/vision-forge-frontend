// src/hooks/useAuth.ts
import { useState, useEffect } from "react";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // TODO: Check if token exists and set user info
  }, []);

  const login = async (credentials: any) => {
    // TODO: Implement login logic (using authService)
  };

  const logout = () => {
    // TODO: Implement logout logic
  };

  return { user, login, logout };
};

export default useAuth;
