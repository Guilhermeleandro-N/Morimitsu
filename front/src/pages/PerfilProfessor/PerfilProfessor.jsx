import React from "react";
import "./PerfilProfessor.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import { buscarProfessorEUsuario } from "../../services/professorService";
import { atualizarStatusUsuario } from "../../services/userService";
import { BuscarAlunoCompletoPorUserId } from "../../services/alunoService";
import {
  listarFrequenciasAluno,
  editarFrequencia,
} from "../../services/frequenciaService";
import { listarTurmas } from "../../services/turmaService";
import RoleGuard from "../../routes/RoleGuard";
import { AuthContext } from "../../context/AuthContext";

const PerfilProfessor = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.id;

  const [professorData, setProfessorData] = useState(null);
  const [alunoData, setAlunoData] = useState(null);
  const [primeiraLetra, setPrimeiraLetra] = useState("");
  const [historico, setHistorico] = useState([]);
  const [nomesTurmas, setNomesTurmas] = useState({});
  const [presencas, setPresencas] = useState(0);

  async function togglePresenca(item) {
    const novoStatus =
      item.status_presenca === "PRESENTE" ? "AUSENTE" : "PRESENTE";
    setHistorico((prev) =>
      prev.map((freq) =>
        freq.id === item.id ? { ...freq, status_presenca: novoStatus } : freq,
      ),
    );
    try {
      await editarFrequencia(item.id, { status_presenca: novoStatus });
    } catch (error) {
      console.error(error);
      setHistorico((prev) =>
        prev.map((freq) =>
          freq.id === item.id
            ? { ...freq, status_presenca: item.status_presenca }
            : freq,
        ),
      );
    }
  }

  async function buscarFrequencias(alunoId) {
    try {
      const [frequencias, turmas] = await Promise.all([
        listarFrequenciasAluno(alunoId),
        listarTurmas(),
      ]);
      const mapaTurmas = {};
      turmas.forEach((t) => {
        mapaTurmas[t.id] = t.nome;
      });
      setNomesTurmas(mapaTurmas);
      setHistorico(frequencias);
    } catch (error) {
      console.error("Erro ao buscar frequências:", error);
    }
  }

  function formatarDataBR(data) {
    if (!data) return "--";
    const iso = data.toString();
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return `${match[3]}/${match[2]}/${match[1]}`;
    return data;
  }

  async function buscarDados() {
    if (!userId) return;
    try {
      const response = await buscarProfessorEUsuario(userId);
      setProfessorData(response.professor);
      setPrimeiraLetra(response.professor.nome?.charAt(0) ?? "");
      try {
        const aluno = await BuscarAlunoCompletoPorUserId(userId);
        setAlunoData(aluno);
        setPresencas(aluno.frequencia_atual ?? 0);
        await buscarFrequencias(aluno.id);
      } catch {
        setHistorico([]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    buscarDados();
  }, [userId]);

  async function handleToggleStatus() {
    const statusAtual = professorData?.status || "ENABLED";
    const novoStatus = statusAtual === "ENABLED" ? "DISABLED" : "ENABLED";
    try {
      await atualizarStatusUsuario(userId, novoStatus);
      setProfessorData((prev) => ({ ...prev, status: novoStatus }));
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
  }

  function statusLabel(s) {
    switch (s) {
      case "ENABLED":
        return "Ativo";
      case "DISABLED":
        return "Inativo";
      case "DISMISSED":
        return "Desligado";
      default:
        return "Ativo";
    }
  }

  const dados = professorData || {};

  return (
    <div className="container">
      <header className="page-header">
        <div className="header-info">
          <h1>Perfil do Professor</h1>
          <p>Visualize os dados do professor</p>
        </div>
        <RoleGuard allowedRoutes={["admin", "professor"]}>
          <button
            className="btn-edit"
            onClick={() =>
              navigate("/editarProfessor", { state: professorData })
            }
          >
            Editar Professor
          </button>
        </RoleGuard>
      </header>

      <div className="profile-grid">
        <aside className="sidebar-card">
          <h2 className="card-title">Dados Pessoais</h2>
          <div className="avatar-container">
            <div className="avatar-placeholder">{primeiraLetra}</div>
          </div>
          <h3 className="student-name">{dados.nome || "Professor"}</h3>
          <RoleGuard allowedRoutes={["admin"]}>
            <button
              className={`status-badge ${String(dados.status || "enabled").toLowerCase()}`}
              onClick={handleToggleStatus}
              style={{ cursor: "pointer", border: "none" }}
            >
              {statusLabel(dados.status)}
            </button>
          </RoleGuard>
          {user && !user.roles.includes("admin") && (
            <span
              className={`status-badge ${String(dados.status || "enabled").toLowerCase()}`}
            >
              {statusLabel(dados.status)}
            </span>
          )}
          <div className="personal-details">
            <p>
              <strong>E-mail:</strong> {dados.email || "--"}
            </p>
            <p>
              <strong>Telefone:</strong> {dados.telefone || "--"}
            </p>
            <p>
              <strong>Nascimento:</strong>{" "}
              {formatarDataBR(dados.data_nascimento)}
            </p>
            <p>
              <strong>Faixa:</strong> {dados.faixa || "--"}
            </p>
            <p>
              <strong>Grau:</strong> {dados.grau ?? "--"}
            </p>
          </div>
        </aside>

        <section className="content-card">
          <div className="history-header">
            <h3>Histórico de Frequências</h3>
            <div className="presence-total">
              <span>Presenças:</span>
              <strong>{presencas}</strong>
            </div>
          </div>

          <table className="history-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Presença</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Turma</th>
              </tr>
            </thead>
            <tbody>
              {historico.length > 0 ? (
                historico.map((item) => (
                  <tr key={item.id}>
                    <td>{formatarDataBR(item.data)}</td>
                    <td>
                      <div className="presence-status">
                        <span>{item.status_presenca}</span>
                        <RoleGuard allowedRoutes={["admin", "professor"]}>
                          <button
                            className={`presence-button ${item.status_presenca === "PRESENTE" ? "present" : "absent"}`}
                            onClick={() => togglePresenca(item)}
                            title="Alterar presença"
                          />
                        </RoleGuard>
                      </div>
                    </td>
                    <td>
                      {new Date(item.horario_inicio).toLocaleTimeString(
                        "pt-BR",
                      )}
                    </td>
                    <td>
                      {new Date(item.horario_fim).toLocaleTimeString("pt-BR")}
                    </td>
                    <td>{nomesTurmas[item.turma_id] || "--"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    Nenhum histórico encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default PerfilProfessor;
