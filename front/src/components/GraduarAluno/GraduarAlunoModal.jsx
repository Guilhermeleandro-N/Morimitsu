import React, { useState } from "react";
import "./GraduarAlunoModal.css";

const GraduarAlunoModal = ({ onClose, onSave }) => {
  const [faixa, setFaixa] = useState("");
  const [grau, setGrau] = useState("");

  const handleSubmit = () => {
    onSave({
      faixa,
      grau_faixa: Number(grau)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="graduar-modal">

        <div className="modal-header">
          <h2>Graduar Aluno</h2>
          <p>Adicionar um novo grau ou faixa</p>
        </div>

        <div className="modal-body">

          <label>Faixa</label>

          <select
            value={faixa}
            onChange={(e) => setFaixa(e.target.value)}
          >
            <option value="">Ex: Azul</option>
            <option value="Branca">Branca</option>
            <option value="Azul">Azul</option>
            <option value="Roxa">Roxa</option>
            <option value="Marrom">Marrom</option>
            <option value="Preta">Preta</option>
          </select>

          <label>Graus</label>

          <select
            value={grau}
            onChange={(e) => setGrau(e.target.value)}
          >
            <option value="">De 0 a 4</option>
            <option value="0">Nenhum Grau</option>
            <option value="1">1º Grau</option>
            <option value="2">2º Grau</option>
            <option value="3">3º Grau</option>
            <option value="4">4º Grau</option>
          </select>

        </div>

        <div className="modal-footer">
          <button
            className="btn-cancelar"
            onClick={onClose}
          >
            Sair
          </button>

          <button
            className="btn-salvar"
            onClick={handleSubmit}
          >
            Salvar
          </button>
        </div>

      </div>
    </div>
  );
};

export default GraduarAlunoModal;