import { createContext, useContext } from "react";

export const ToastContext = createContext(null);

export default function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de <ToastProvider>");
  }
  return ctx;
}
