import { useContext, createContext, ReactNode, useState } from "react";

interface ISnackbarContextProps {
  children: ReactNode;
}

interface SnackbarContext {
  toasts: IToast[];
  removeToast: (index: number) => void;
  addToast: (text: string, severity: ISeverity) => void;
  clearToasts: () => void;
}

interface IToast {
  text: string;
  id: number;
  severity: ISeverity;
}

export type ISeverity = "error" | "info" | "success" | "warning";

const SnackbarContext = createContext<SnackbarContext | undefined>(undefined);

export const SnackbarProvider = ({ children }: ISnackbarContextProps) => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const removeToast = (index: number) => {
    console.log("removeToast.index: ", index);
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== index));
  };
  const addToast = (text: string, severity: ISeverity) => {
    const toastObj = {
      id: toasts.length,
      text: text,
      severity: severity,
    };
    setToasts((prev) => [...prev, toastObj]);
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return (
    <SnackbarContext.Provider
      value={{
        toasts,
        removeToast,
        addToast,
        clearToasts,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error(
      "useSnackbarContext must be used within a SnackbarProvider"
    );
  }
  return context;
};
