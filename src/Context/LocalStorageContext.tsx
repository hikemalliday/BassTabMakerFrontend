import React, { useEffect, useState, useContext, createContext } from "react";
import { jwtDecode } from "jwt-decode";
interface ITokens {
  access: string;
  refresh: string;
}

interface ILocalStorageContextProps {
  children: React.ReactNode;
}

interface ILocalStorageContext {
  access: string;
  setAccess: (accessToken: string) => void;
  refresh: string;
  setRefresh: (refreshToken: string) => void;
  setTokens: (tokens: ITokens) => void;
  isLoading: boolean;
  clearTokens: () => void;
}

const LocalStorageContext = createContext<ILocalStorageContext | undefined>(
  undefined
);

export const LocalStorageProvider = ({
  children,
}: ILocalStorageContextProps) => {
  const [access, setAccess] = useState(localStorage.getItem("access") ?? "");
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh") ?? "");
  const [isLoading, setIsLoading] = useState(true);

  const setTokens = (tokens: ITokens) => {
    setAccess(tokens.access);
    setRefresh(tokens.refresh);
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
  };

  const clearTokens = () => {
    setAccess("");
    setRefresh("");
    localStorage.clear();
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    const refreshToken = localStorage.getItem("refresh");
    const currentTime = Math.floor(Date.now() / 1000);

    if (access && refresh) {
      const decode = jwtDecode(refresh);
      if (decode.exp && decode.exp > currentTime) {
        setAccess(accessToken as string);
        setRefresh(refreshToken as string);
      }
    }
    // Need a boolean for our <ProtectedRoute/>
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (access && refresh) {
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
    }
  }, [access, refresh]);

  return (
    <LocalStorageContext.Provider
      value={{
        access,
        setAccess,
        refresh,
        setRefresh,
        setTokens,
        isLoading,
        clearTokens,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorageContext = () => {
  const context = useContext(LocalStorageContext);
  if (context === undefined) {
    throw new Error(
      "useLocalStorageContext must be called within a LocalStorageContextProvider."
    );
  }
  return context;
};
