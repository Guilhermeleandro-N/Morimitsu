import "./ToastContainer.css";

function ToastContainer({ toasts, removeToast }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-message ${toast.type}`}>
          <span className="toast-icon">{toast.type === "success" ? "✔" : "✖"}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
