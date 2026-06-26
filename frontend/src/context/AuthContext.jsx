import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFullProfile = useCallback(async () => {
    try {
      const res = await api.get("/user/profile");
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch {
      // Token expired or invalid -clear session
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (isMounted) setLoading(false);
          return;
        }

        // Try cached user for instant render
        const cached = localStorage.getItem("user");
        if (cached && cached !== "undefined") {
          try {
            if (isMounted) setUser(JSON.parse(cached));
          } catch {}
        }

        // Always refresh from server to get full profile
        if (isMounted) await fetchFullProfile();
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();
    return () => {
      isMounted = false;
    };
  }, [fetchFullProfile]);

  const login = (data) => {
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }
    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser, refreshProfile: fetchFullProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
