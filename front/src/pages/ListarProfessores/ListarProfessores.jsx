import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { listarProfessores } from "../../services/professorService";

import { atualizarStatusUsuario } from "../../services/userService";

import { listarAlunosCompleto } from "../../services/alunoService";

import { listarPerfisDoUsuario } from "../../services/authorizationService";

import { FaEye, FaTrash, FaArchive } from "react-icons/fa";

import "./ListarProfessores.css";

function ListarProfessores() {
  const navigate = useNavigate();

  function abrirPerfil(userId) {
    navigate("/perfilProfessor", {
      state: {
        id: userId,
      },
    });
  }

  const [professores, setProfessores] = useState([]);

  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  async function carregarProfessores() {
    try {
      const [response, alunos] = await Promise.all([
        listarProfessores(),
        listarAlunosCompleto(),
      ]);

      // Filtra administradores da lista de professores
      const professoresSemAdmin = [];
      for (const professor of response) {
        try {
          const perfis = await listarPerfisDoUsuario(professor.usuarioId);
          const isAdmin = perfis.some((p) => p.nome?.toLowerCase() === "admin");
          if (!isAdmin) professoresSemAdmin.push(professor);
        } catch {
          professoresSemAdmin.push(professor);
        }
      }

      const mapaFrequencia = {};
      alunos.forEach((a) => {
        mapaFrequencia[a.usuarioId] = a.frequencia_atual ?? 0;
      });

      const professoresComFrequencia = professoresSemAdmin.map((p) => ({
        ...p,
        frequencia: mapaFrequencia[p.usuarioId] ?? 0,
      }));

      setProfessores(professoresComFrequencia);
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
    }
  }

  useEffect(() => {
    carregarProfessores();
  }, []);

  const professoresFiltrados =
    filtroStatus === "TODOS"
      ? professores
      : professores.filter((p) => p.status === filtroStatus);

  async function handleArquivar(professor) {
    const novoStatus = professor.status === "ENABLED" ? "DISABLED" : "ENABLED";
    try {
      await atualizarStatusUsuario(professor.usuarioId, novoStatus);
      setProfessores((prev) =>
        prev.map((p) =>
          p.usuarioId === professor.usuarioId
            ? { ...p, status: novoStatus }
            : p,
        ),
      );
    } catch (error) {
      console.error("Erro ao arquivar:", error);
    }
  }

  function statusLabel(status) {
    switch (status) {
      case "ENABLED":
        return "Ativo";
      case "DISABLED":
        return "Inativo";
      case "DISMISSED":
        return "Desligado";
      default:
        return status || "—";
    }
  }

  return (
    <div className="listar-container">
      <div className="page-header">
        <div>
          <h1>Lista de Professores</h1>

          <p>Professores cadastrados na plataforma</p>
        </div>

        <select
          className="status-filter-select"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="TODOS">Todos</option>
          <option value="ENABLED">Ativos</option>
          <option value="DISABLED">Inativos</option>
        </select>
      </div>

      <div className="listar-card">
        <div className="listar-header">
          <h2>Professores</h2>

          <p>Total de {professoresFiltrados.length} professores cadastrados</p>
        </div>

        <div className="table-container">
          <table className="tabela-alunos">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Faixa</th>
                <th>Grau</th>
                <th>Frequência</th>
                <th>Status</th>
                <th>Arquivar</th>
                <th>Excluir</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {professoresFiltrados.map((professor) => (
                <tr key={professor.id}>
                  <td>{professor.nome}</td>

                  <td>{professor.faixa}</td>

                  <td>{professor.grau}</td>

                  <td>{professor.frequencia ?? 0}</td>

                  <td>
                    <span
                      className={
                        professor.status === "ENABLED"
                          ? "status ativo"
                          : professor.status === "DISMISSED"
                            ? "status desligado"
                            : "status inativo"
                      }
                    >
                      {statusLabel(professor.status)}
                    </span>
                  </td>

                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => handleArquivar(professor)}
                    >
                      <FaArchive />
                    </button>
                  </td>

                  <td>
                    <button className="icon-btn delete">
                      <FaTrash />
                    </button>
                  </td>

                  <td>
                    <button
                      className="perfil-btn"
                      onClick={() => abrirPerfil(professor.usuarioId)}
                    >
                      <FaEye />
                      Ver Perfil
                    </button>
                  </td>
                </tr>
              ))}

              {professores.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    Nenhum professor encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListarProfessores;
