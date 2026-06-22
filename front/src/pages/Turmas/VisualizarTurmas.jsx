import React, { useEffect, useState, useRef } from "react";

import "./VisualizarTurmas.css";

import CriarTurmaModal from "../../components/CriarTurma/CriarTurmaModal.jsx";

import EditarTurmaModal from "../../components/EditarTurma/EditarTurmaModal";

import { listarTurmas } from "../../services/turmaService";

import RoleGuard from "../../routes/RoleGuard";

import { useNavigate } from "react-router-dom";

function VisualizarTurmas() {
  const [menuAberto, setMenuAberto] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const [editarModalOpen, setEditarModalOpen] = useState(false);

  const [turmaSelecionada, setTurmaSelecionada] = useState(null);

  const navigate = useNavigate();
  const [turmas, setTurmas] = useState([]);

  const buscarTurmas = async () => {
  const response = await listarTurmas();
  setTurmas(response);
};


  useEffect(() => {
    buscarTurmas();
  }, []);

function formatarHorario(data) {
  return new Date(data).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

  function obterDiasSemana(turma) {

    const dias = [];

    if (turma.segunda) dias.push("SEG");
    if (turma.terca) dias.push("TER");
    if (turma.quarta) dias.push("QUA");
    if (turma.quinta) dias.push("QUI");
    if (turma.sexta) dias.push("SEX");
    if (turma.sabado) dias.push("SAB");
    if (turma.domingo) dias.push("DOM");

    return dias.join(" • ");

  }

  const criarNovaTurma = (novaTurma) => {

    setTurmas((prev) => [...prev, novaTurma]);

    setModalOpen(false);

  };

  return (
    <div className="turmas-container">

      <div className="turmas-header">

        <div>

          <h1>Visualizar Turmas</h1>

          <p>Visualize todas as turmas cadastradas</p>

        </div>
        <RoleGuard allowedRoutes={["admin", "professor"]} >
          <button
            className="btn-criar"
            onClick={() => setModalOpen(true)}
          >
            Criar Turma
          </button>
        </RoleGuard>
      </div>

      <div className="turmas-grid">

        {turmas.map((turma) => (

          <div
            className="turma-card"
            key={turma.id}
            onClick={() =>
              navigate("/alunosTurma", {
                state: {
                  turmaId: turma.id,
                  turmaNome: turma.nome,
                  turmaHorarioInicio: turma.horario_inicio,
                  turmaHorarioFim: turma.horario_fim
                },
              })
            }
          >

            <div className="turma-banner">

              <div>

                <h3>{turma.nome}</h3>

                <span>
                  {formatarHorario(turma.horario_inicio)}
                  {" - "}
                  {formatarHorario(turma.horario_fim)}
                </span>

              </div>

            </div>

            <div className="turma-content">

              <div className="dias-container">

                {obterDiasSemana(turma)}

              </div>

              {turma.data_especifica && (
                <div className="data-especifica">

                  Aula específica

                </div>
              )}

            </div>

            <div className="turma-footer">

              <div className="menu-container">
                <button
                  className="menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    setMenuAberto(
                      menuAberto === turma.id ? null : turma.id
                    );
                  }}
                >
                  ⋮
                </button>

                {menuAberto === turma.id && (
                  <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setTurmaSelecionada(turma);
                        setEditarModalOpen(true);
                        setMenuAberto(null);
                      }}
                    >
                      Editar Turma
                    </button>

                    <button
                      onClick={() => {
                        console.log("Mover", turma.id);
                        setMenuAberto(null);
                      }}
                    >
                      Mover
                    </button>

                    <button
                      onClick={() => {
                        console.log("Ocultar", turma.id);
                        setMenuAberto(null);
                      }}
                    >
                      Ocultar
                    </button>

                    <button
                      className="danger"
                      onClick={() => {
                        console.log("Excluir", turma.id);
                        setMenuAberto(null);
                      }}
                    >
                      Excluir Turma
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

        ))}

      </div>

      {modalOpen && (
        <CriarTurmaModal
          onClose={() => setModalOpen(false)}
          onCreate={criarNovaTurma}
        />
      )}

    {editarModalOpen && turmaSelecionada && (
      <EditarTurmaModal
        turma={turmaSelecionada}
        onClose={() => {
          setEditarModalOpen(false);
          setTurmaSelecionada(null);
        }}
        onSave={async (dados) => {
          console.log("Turma editada:", dados);

          await buscarTurmas();

          setEditarModalOpen(false);
          setTurmaSelecionada(null);
        }}
      />
    )}
    </div>
  );
}

export default VisualizarTurmas;