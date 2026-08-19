import React from "react";
import "../PerfilAluno/PerfilAluno.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import { buscarProfessorEUsuario } from "../../services/professorService";
import { atualizarStatusUsuario } from "../../services/userService";
import {
  listarTreinosPorProfessor,
  editarTreino,
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
  const [primeiraLetra, setPrimeiraLetra] = useState("");
  const [historico, setHistorico] = useState([]);
  const [nomesTurmas, setNomesTurmas] = useState({});
  const [presencas, setPresencas] = useState(0);

  async function buscarTreinos(professorId) {
    try {
      const [treinos, turmas] = await Promise.all([
        listarTreinosPorProfessor(professorId),
        listarTurmas(),
      ]);
      const mapaTurmas = {};
      turmas.forEach((t) => {
        mapaTurmas[t.id] = t.nome;
      });
      setNomesTurmas(mapaTurmas);
      setHistorico(Array.isArray(treinos) ? treinos : []);
      setPresencas(Array.isArray(treinos) ? treinos.length : 0);
    } catch (error) {
      console.error("Erro ao buscar treinos:", error);
      setHistorico([]);
      setPresencas(0);
    }
  }

  function statusPresenca(statusAula) {
    switch (statusAula) {
      case "CANCELADA":
        return "AUSENTE";
      case "REMARCADA":
        return "REMARCADA";
      default:
        return "PRESENTE";
    }
  }

  async function togglePresenca(item) {
    const novoStatus =
      item.status_aula === "REALIZADA" ? "CANCELADA" : "REALIZADA";
    setHistorico((prev) =>
      prev.map((t) =>
        t.id === item.id ? { ...t, status_aula: novoStatus } : t,
      ),
    );
    try {
      await editarTreino(item.id, { status_aula: novoStatus });
    } catch (error) {
      console.error(error);
      setHistorico((prev) =>
        prev.map((t) =>
          t.id === item.id ? { ...t, status_aula: item.status_aula } : t,
        ),
      );
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
      const professor = response.professor || {};
      const usuario = response.usuario || {};
      setProfessorData({
        ...usuario,
        ...professor,
        faixa: professor.faixa || usuario.faixa || "--",
        grau: professor.grau ?? usuario.grau ?? 0,
      });
      setPrimeiraLetra(
        (professor.nome || usuario.nome || "").charAt(0).toUpperCase(),
      );
      if (professor.id) {
        await buscarTreinos(professor.id);
      } else {
        setHistorico([]);
        setPresencas(0);
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

  const dados = professorData || {};

  return (
    <div className="container">
      <header className="page-header">
        <div className="header-info">
          <h1>Perfil do Professor</h1>
          <p>Visualize os dados do professor</p>
        </div>
        <RoleGuard allowedRoutes={["admin"]}>
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
          <h3 className="perfil-aluno-student-name">
            {dados.nome || "Professor"}
          </h3>
          <RoleGuard allowedRoutes={["admin"]}>
            <button
              className={`perfil-aluno-status-badge ${String(
                dados.status || "ENABLED",
              ).toLowerCase()}`}
              onClick={handleToggleStatus}
              style={{ cursor: "pointer", border: "none" }}
            >
              {dados.status === "ENABLED" ? "Ativo" : "Inativo"}
            </button>
          </RoleGuard>
          {user && !user.roles.includes("admin") && (
            <span
              className={`perfil-aluno-status-badge ${String(
                dados.status || "ENABLED",
              ).toLowerCase()}`}
            >
              {dados.status === "ENABLED" ? "Ativo" : "Inativo"}
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
            <h3>Histórico Recente</h3>
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
                        <span>{statusPresenca(item.status_aula)}</span>
                        <button
                          className={`presence-button ${item.status_aula === "REALIZADA" ? "present" : "absent"}`}
                          onClick={() => togglePresenca(item)}
                          title="Alterar presença"
                        />
                      </div>
                    </td>
                    <td>{new Date(item.data).toLocaleTimeString("pt-BR")}</td>
                    <td>--</td>
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
