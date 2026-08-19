import React from "react";
import "./ConfirmModal.css";

function ConfirmModal({
  title = "Confirmar exclusão",
  message,
  confirmText = "Excluir",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal-container">
        <div className="confirm-modal-header">
          <h2>{title}</h2>
        </div>

        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>

        <div className="confirm-modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn-delete" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
