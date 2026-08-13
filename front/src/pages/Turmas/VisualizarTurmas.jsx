import React, { useEffect, useState, useContext } from "react";

import "./VisualizarTurmas.css";

import CriarTurmaModal from "../../components/CriarTurma/CriarTurmaModal.jsx";

import EditarTurmaModal from "../../components/EditarTurma/EditarTurmaModal";

import {
  listarTurmas,
  arquivarTurma,
  excluirTurma,
} from "../../services/turmaService";

import RoleGuard from "../../routes/RoleGuard";

import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

function VisualizarTurmas() {
  const { user } = useContext(AuthContext);
  const [menuAberto, setMenuAberto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [confirmExcluirOpen, setConfirmExcluirOpen] = useState(false);
  const [turmaParaExcluir, setTurmaParaExcluir] = useState(null);

  const navigate = useNavigate();
  const [turmas, setTurmas] = useState([]);

  const buscarTurmas = async () => {
    const response = await listarTurmas();
    setTurmas(Array.isArray(response) ? response : []);
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

  const handleArquivar = async (turmaId) => {
    try {
      await arquivarTurma(turmaId);
      setMenuAberto(null);
      await buscarTurmas();
    } catch (error) {
      console.error("Erro ao arquivar turma:", error);
    }
  };

  function abrirConfirmacaoExcluir(turmaId) {
    setTurmaParaExcluir(turmaId);
    setConfirmExcluirOpen(true);
  }

  async function handleExcluir() {
    if (!turmaParaExcluir) return;

    try {
      await excluirTurma(turmaParaExcluir);
      setTurmas((prev) =>
        prev.filter((turma) => turma.id !== turmaParaExcluir)
      );
      setMenuAberto(null);
    } catch (error) {
      console.error("Erro ao excluir turma:", error);
      alert("Erro ao excluir turma.");
    } finally {
      setConfirmExcluirOpen(false);
      setTurmaParaExcluir(null);
    }
  }

  function fecharConfirmacaoExcluir() {
    setConfirmExcluirOpen(false);
    setTurmaParaExcluir(null);
  }

  return (
    <div className="turmas-container">
      <div className="turmas-header">
        <div>
          <h1>Visualizar Turmas</h1>

          <p>Visualize todas as turmas cadastradas</p>
        </div>
        <div className="turmas-header-actions">
          <RoleGuard allowedRoutes={["admin", "professor"]}>
            <button className="btn-criar" onClick={() => setModalOpen(true)}>
              Criar Turma
            </button>
          </RoleGuard>
        </div>
      </div>

      <div className="turmas-grid">
        {turmas.map((turma) => (
          <div
            className="turma-card"
            key={turma.id}
            onClick={() => {
              const ehGestor =
                user &&
                (user.roles || []).some((r) =>
                  ["admin", "professor"].includes(r)
                );
              if (!ehGestor) return;
              navigate("/alunosTurma", {
                state: {
                  turmaId: turma.id,
                  turmaNome: turma.nome,
                  turmaHorarioInicio: turma.horario_inicio,
                  turmaHorarioFim: turma.horario_fim,
                  turmaStatus: turma.status,
                },
              });
            }}
            style={user && !(user.roles || []).some((r) => ["admin", "professor"].includes(r)) ? { cursor: "default" } : undefined}
          >
            <div className="turma-banner">
              <div>
                <div className="turma-title-row">
                  <div className="turma-title">
                    <h3 title={turma.nome}>{turma.nome}</h3>
                  </div>
                </div>
                <div className="turma-status-row">
                  <span
                    className={`status-badge ${turma.status === "ATIVO" ? "status-ativo" : "status-inativo"}`}
                  ></span>
                </div>

                <span className="turma-horario">
                  {formatarHorario(turma.horario_inicio)}
                  {" - "}
                  {formatarHorario(turma.horario_fim)}
                  {turma.professores?.length > 0 && (
                    <span className="turma-professor">
                      {" • Prof.: "}
                      {turma.professores.join(", ")}
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="turma-content">
              <div className="dias-container">{obterDiasSemana(turma)}</div>
            </div>

            <div className="turma-footer">
              <RoleGuard allowedRoutes={["admin", "professor"]}>
              <div className="menu-container">
                <button
                  className="menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();

                    setMenuAberto(menuAberto === turma.id ? null : turma.id);
                  }}
                >
                  ⋮
                </button>

                {menuAberto === turma.id && (
                  <div
                    className="dropdown-menu"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                        handleArquivar(turma.id);
                      }}
                    >
                      Arquivar Turma
                    </button>

                    <button
                      className="danger"
                      onClick={() => {
                        abrirConfirmacaoExcluir(turma.id);
                      }}
                    >
                      Excluir Turma
                    </button>
                  </div>
                )}
              </div>
              </RoleGuard>
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

      {confirmExcluirOpen && turmaParaExcluir && (
        <ConfirmModal
          title="Confirmar exclusão"
          message="Deseja realmente excluir esta turma? Todos os vínculos e registros dela serão removidos."
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={handleExcluir}
          onCancel={fecharConfirmacaoExcluir}
        />
      )}
    </div>
  );
}

export default VisualizarTurmas;
