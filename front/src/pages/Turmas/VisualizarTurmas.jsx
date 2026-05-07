import React, { useState } from "react";
import "./VisualizarTurmas.css";
import CriarTurmaModal from "./CriarTurmaModal";

const turmasMock = [
  {
    id: 1,
    nome: "Terça-Noite",
    horario: "18:20-20:00",
  },
  {
    id: 2,
    nome: "Quarta-Tarde",
    horario: "13:00-15:00",
  },
  {
    id: 3,
    nome: "Quinta-Tarde",
    horario: "15:00-17:00",
  },
  {
    id: 4,
    nome: "Quinta-Noite",
    horario: "18:20-20:00",
  },
  {
    id: 5,
    nome: "Sexta-Tarde",
    horario: "13:00-15:00",
  },
  {
    id: 6,
    nome: "Sexta-Noite",
    horario: "18:20-20:00",
  },
];

function VisualizarTurmas() {
  const [turmas, setTurmas] = useState(turmasMock);
  const [modalOpen, setModalOpen] = useState(false);

  const criarTurma = (novaTurma) => {
    setTurmas([
      ...turmas,
      {
        id: Date.now(),
        ...novaTurma,
      },
    ]);

    setModalOpen(false);
  };

  return (
    <div className="turmas-container">
      <div className="turmas-header">
        <div>
          <h1>Visualizar Turmas</h1>
          <p>Visualizar Turmas Existentes</p>
        </div>

        <button
          className="btn-criar"
          onClick={() => setModalOpen(true)}
        >
          Criar Turma
        </button>
      </div>

      <div className="turmas-grid">
        {turmas.map((turma) => (
          <div className="turma-card" key={turma.id}>
            <div className="turma-banner">
              <div>
                <h3>{turma.nome}</h3>
                <span>{turma.horario}</span>
              </div>
            </div>

            <div className="turma-footer">
              <button className="menu-btn">⋮</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <CriarTurmaModal
          onClose={() => setModalOpen(false)}
          onCreate={criarTurma}
        />
      )}
    </div>
  );
}

export default VisualizarTurmas;