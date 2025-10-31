import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useFetch } from "../hooks/useFetch";
import { User } from "../types/Types";

type AuthContextType = {
  token: string | null;
  user: User | null;
  setUser: (user: User | null) => void;
  isCheckingAuth: boolean;
  setAuth: (token: string | null, user?: User | null) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { post } = useFetch(process.env.EXPO_PUBLIC_BASE_URL);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ---- Storage helper (chỉ SecureStore) ----
  const storage = {
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    getItem: (key: string) => SecureStore.getItemAsync(key),
    deleteItem: (key: string) => SecureStore.deleteItemAsync(key),
  };

  // ---- Xác thực token ----
  const verifyToken = async (jwt: string): Promise<User | null> => {
    try {
      const response = await post("/users/verifyToken", { token: jwt });
      return response?.user ?? null;
    } catch {
      return null;
    }
  };

  const setAuth = async (newToken: string | null, newUser?: User | null) => {
  if (newToken && newUser) {
    await storage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  } else {
    await storage.deleteItem("token");
    setToken(null);
    setUser(null);
  }
};

  const logout = async () => {
    await setAuth(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = await storage.getItem("token");
      if (savedToken) {
        const verifiedUser = await verifyToken(savedToken);
        if (verifiedUser) await setAuth(savedToken, verifiedUser);
        else await logout();
      }
      setIsCheckingAuth(false);
    };
    initializeAuth();
  }, []);

  // ---- Khi token thay đổi ----
  useEffect(() => {
    const updateUser = async () => {
      if (token) {
        const verifiedUser = await verifyToken(token);
        if (verifiedUser) setUser(verifiedUser);
        else await logout();
      }
    };
    updateUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, user, setUser, isCheckingAuth, setAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---- Hook tiện dùng ----
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
