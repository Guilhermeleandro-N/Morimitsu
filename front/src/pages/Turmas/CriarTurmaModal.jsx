import React, { useState } from "react";
import "./CriarTurmaModal.css";

function CriarTurmaModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    nome: "",
    horario: "",
    professor: "",
    quantidade: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onCreate(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Criar nova turma</h2>

        <div className="modal-form">
          <div className="input-group">
            <label>Nome da turma</label>
            <input
              type="text"
              name="nome"
              placeholder="Ex: Turma Quinta à noite"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Horário</label>
            <input
              type="text"
              name="horario"
              placeholder="Ex: 18:20 - 20:00"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Professor</label>
            <input
              type="text"
              name="professor"
              placeholder="Ex: Saulo Bezerra"
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Quantidade de alunos</label>
            <input
              type="number"
              name="quantidade"
              placeholder="30"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn-sair" onClick={onClose}>
            Sair
          </button>

          <button className="btn-salvar" onClick={handleSubmit}>
            Criar Turma
          </button>
        </div>
      </div>
    </div>
  );
}

export default CriarTurmaModal;