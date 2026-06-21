/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState
} from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData || userData === "undefined") {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch {
      console.error("Invalid user in localStorage");

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return null;
    }
  });
  const [loading] = useState(false);

  const login = (data) => {
    localStorage.setItem("token", data.token);

    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}