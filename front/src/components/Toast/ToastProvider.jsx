import { useCallback, useState } from "react";
import Toast from "./Toast";
import { ToastContext } from "./useToast";

const DURACAO = 3000;

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const mostrar = useCallback((mensagem, tipo = "success") => {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), DURACAO);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, mostrar }}>
      {children}
      <Toast toast={toast} />
    </ToastContext.Provider>
  );
}
