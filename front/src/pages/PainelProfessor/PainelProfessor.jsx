import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarDashboardProfessor } from "../../services/professorService";
import { graduarProximoNivel } from "../../services/alunoService";
import { FaGraduationCap, FaBirthdayCake } from "react-icons/fa";
import "./PainelProfessor.css";

function PainelProfessor() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [graduando, setGraduando] = useState(null);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  async function carregarDashboard() {
    try {
      const data = await buscarDashboardProfessor();
      setDashboard(data);
    } catch (error) {
      console.error("Erro ao carregar painel:", error);
    } finally {
      setLoading(false);
    }
  }

  function mostrarToast(mensagem, tipo = "success") {
    setToast({ mensagem, tipo });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    carregarDashboard();
  }, []);

  async function handleGraduar(item) {
    if (graduando) return;
    setGraduando(item.aluno_id);
    try {
      await graduarProximoNivel(item.aluno_id, item.turma_id);
      await carregarDashboard();
      mostrarToast(`${item.nome} graduado(a) com sucesso!`, "success");
    } catch (error) {
      mostrarToast(
        error?.response?.data?.message || "Erro ao graduar aluno.",
        "error"
      );
    } finally {
      setGraduando(null);
    }
  }

  if (loading) {
    return (
      <div className="painel-container">
        <p>Carregando painel...</p>
      </div>
    );
  }

  const graduacoes = dashboard?.proximos_graduacao || [];
  const aniversarios = dashboard?.proximos_aniversario || [];

  return (
    <div className="painel-container">
      {toast && (
        <div className={`painel-toast ${toast.tipo}`}>
          {toast.mensagem}
        </div>
      )}
      <div className="painel-header">
        <h1>Painel do Professor</h1>
        <p>Visão geral dos alunos das suas turmas</p>
      </div>

      <div className="painel-grid">
        <div className="painel-section">
          <div className="section-header">
            <FaGraduationCap className="section-icon" />
            <h2>Próximos da Graduação</h2>
          </div>
          <p className="section-subtitle">
            Alunos com até 5 frequências restantes para a próxima graduação
          </p>

          {graduacoes.length === 0 ? (
            <div className="empty-state">
              Nenhum aluno próximo da graduação no momento.
            </div>
          ) : (
            <div className="cards-grid">
              {graduacoes.map((item) => (
                <div key={item.aluno_id} className="dashboard-card">
                  <div className="card-top">
                    <h3>{item.nome}</h3>
                    <span className="faixa-badge">{item.faixa}</span>
                  </div>
                  <div className="card-info">
                    <p>
                      <strong>Turma:</strong> {item.turma_nome}
                    </p>
                    <p>
                      <strong>Grau atual:</strong> {item.grau_faixa}
                    </p>
                    <p>
                      <strong>Frequência atual:</strong>{" "}
                      {item.frequencia_atual}
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="card-actions">
                      <button
                        className="btn-graduar"
                        onClick={() => handleGraduar(item)}
                        disabled={graduando === item.aluno_id}
                      >
                        {graduando === item.aluno_id
                          ? "Graduando..."
                          : "Graduar"}
                      </button>
                      <button
                        className="btn-ver-perfil"
                        onClick={() =>
                          navigate("/perfilAluno", {
                            state: { id: item.usuario_id },
                          })
                        }
                      >
                        Ver Perfil
                      </button>
                    </div>
                    <span className="restantes-badge">
                      {item.frequencias_restantes} frequência
                      {item.frequencias_restantes !== 1 ? "s" : ""} restante
                      {item.frequencias_restantes !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="painel-section">
          <div className="section-header">
            <FaBirthdayCake className="section-icon" />
            <h2>Aniversariantes Próximos</h2>
          </div>
          <p className="section-subtitle">
            Alunos que fazem aniversário nos próximos 30 dias
          </p>

          {aniversarios.length === 0 ? (
            <div className="empty-state">
              Nenhum aniversariante nos próximos 30 dias.
            </div>
          ) : (
            <div className="cards-grid">
              {aniversarios.map((item) => (
                <div key={item.aluno_id} className="dashboard-card birthday-card">
                  <div className="card-top">
                    <h3>{item.nome}</h3>
                    <span className="faixa-badge">{item.faixa}</span>
                  </div>
                  <div className="card-info">
                    <p>
                      <strong>Turma:</strong> {item.turma_nome}
                    </p>
                    <p>
                      <strong>Nascimento:</strong>{" "}
                      {new Date(item.data_nascimento + "T00:00:00").toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                  <div className="card-footer">
                    <span className="dias-badge">
                      {item.dias_restantes === 0
                        ? "Hoje!"
                        : `${item.dias_restantes} dia${item.dias_restantes !== 1 ? "s" : ""}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PainelProfessor;
