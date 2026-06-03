import React, { useEffect, useState } from "react";

import "./VisualizarTurmas.css";

import CriarTurmaModal from "./CriarTurmaModal";

import { listarTurmas } from "../../services/turmaService";

import RoleGuard from "../../routes/RoleGuard";

function VisualizarTurmas() {

  const [turmas, setTurmas] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {

    async function buscarTurmas() {

      const response = await listarTurmas();

      setTurmas(response);

    }

    buscarTurmas();

  }, []);

  function formatarHorario(data) {

    if (!data) return "--:--";

    const date = new Date(data);

    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
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

              <button className="menu-btn">
                ⋮
              </button>

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

    </div>
  );
}

export default VisualizarTurmas;