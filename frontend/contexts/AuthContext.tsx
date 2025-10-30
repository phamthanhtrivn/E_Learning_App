import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { useFetch } from "../hooks/useFetch";

type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  job: string;
  phone: string;
  savedCourses: string[];
};

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => Promise<void>;
  user: User | null;
  logout: () => void;
  isCheckingAuth: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || "http://localhost:7000";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { post } = useFetch(BASE_URL);
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const storage = {
    setItem: async (key: string, value: string) => {
      if (Platform.OS === "web") localStorage.setItem(key, value);
      else await SecureStore.setItemAsync(key, value);
    },
    getItem: async (key: string) => {
      if (Platform.OS === "web") return localStorage.getItem(key);
      return await SecureStore.getItemAsync(key);
    },
    deleteItem: async (key: string) => {
      if (Platform.OS === "web") localStorage.removeItem(key);
      else await SecureStore.deleteItemAsync(key);
    }
  };

  // Khi login thành công
  const setToken = async (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) await storage.setItem("token", newToken);
    else await storage.deleteItem("token");
  };

  const fetchUser = async (jwt: string) => {
    try {
      const response = await post("/users/verifyToken", { token: jwt });
      if (response?.user) setUser(response.user);
      else logout();
    } catch {
      logout();
    }
  };

  const logout = async () => {
    await setToken(null);
    setUser(null);
  };

  // Tự động đọc token khi app mở
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = await storage.getItem("token");
      if (savedToken) {
        setTokenState(savedToken);
        await fetchUser(savedToken);
      }
      setIsCheckingAuth(false);
    };
    initAuth();
  }, []);

  // Khi token thay đổi
  useEffect(() => {
    if (token) fetchUser(token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, logout, isCheckingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
