
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  email: string;
  avatar?: string;
  birthdate?: string;
  orixa?: string;
  iniciationDate?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    const storedUser = localStorage.getItem("user");
    
    if (storedAuth && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to verify credentials
    try {
      // Simulate successful login for demo
      if (email && password) {
        const mockUser = {
          name: "Filho de Xangô",
          email: email,
          avatar: "/placeholder.svg"
        };
        
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsAuthenticated(true);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    // In a real app, this would make an API call to create a new user
    try {
      if (userData.name && userData.email && userData.password) {
        const newUser = {
          name: userData.name,
          email: userData.email,
          birthdate: userData.birthdate,
          orixa: userData.orixa || "Não definido",
          avatar: "/placeholder.svg"
        };
        
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(newUser));
        
        setUser(newUser);
        setIsAuthenticated(true);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
