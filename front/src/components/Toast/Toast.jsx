import "./Toast.css";

function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`app-toast ${toast.tipo}`}>
      <span className="app-toast-icon">
        {toast.tipo === "success" ? "✔" : "✖"}
      </span>
      {toast.mensagem}
    </div>
  );
}

export default Toast;
