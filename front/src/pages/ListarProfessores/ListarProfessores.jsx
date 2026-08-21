import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { listarProfessores, deletarProfessor } from "../../services/professorService";

import { arquivarUsuario } from "../../services/userService";

import { listarAlunosCompleto } from "../../services/alunoService";

import { listarPerfisDoUsuario } from "../../services/authorizationService";

import { FaEye, FaTrash, FaArchive } from "react-icons/fa";

import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

import { useToast } from "../../context/ToastContext";

import "../ListarAlunos/ListarAlunos.css";

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

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedProfessorParaExcluir, setSelectedProfessorParaExcluir] = useState(null);

  const { addToast } = useToast();

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
      : filtroStatus === "ARQUIVADO"
        ? professores.filter((p) => p.arquivado_at)
        : professores.filter(
            (p) => p.status === filtroStatus && !p.arquivado_at,
          );

  async function handleArquivar(professor) {
    const arquivado = !professor.arquivado_at;
    try {
      await arquivarUsuario(professor.usuarioId, arquivado);
      setProfessores((prev) =>
        prev
          .map((p) =>
            p.usuarioId === professor.usuarioId
              ? {
                  ...p,
                  arquivado_at: arquivado
                    ? new Date().toISOString()
                    : null,
                }
              : p,
          )
          .sort((a, b) => {
            if (!!a.arquivado_at !== !!b.arquivado_at) {
              return a.arquivado_at ? 1 : -1;
            }
            return 0;
          }),
      );
      addToast(
        arquivado
          ? "Professor arquivado com sucesso!"
          : "Professor reativado com sucesso!",
        "success",
      );
    } catch (error) {
      console.error("Erro ao arquivar:", error);
      addToast("Erro ao arquivar professor.", "error");
    }
  }

  function abrirConfirmacaoExclusao(professor) {
    setSelectedProfessorParaExcluir(professor);
    setConfirmModalOpen(true);
  }

  async function handleExcluirProfessor() {
    if (!selectedProfessorParaExcluir) {
      return;
    }

    try {
      await deletarProfessor(selectedProfessorParaExcluir.id);
      setProfessores((prev) =>
        prev.filter(
          (p) => p.id !== selectedProfessorParaExcluir.id,
        ),
      );
      addToast("Professor excluído com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao excluir professor:", error);
      addToast("Erro ao excluir professor.", "error");
    } finally {
      setConfirmModalOpen(false);
      setSelectedProfessorParaExcluir(null);
    }
  }

  function fecharConfirmacao() {
    setConfirmModalOpen(false);
    setSelectedProfessorParaExcluir(null);
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

  function getFaixaClass(faixa) {
    switch (faixa?.toLowerCase()) {
      case "branca": return "faixa branca";
      case "amarela": return "faixa amarela";
      case "laranja": return "faixa laranja";
      case "verde": return "faixa verde";
      case "azul": return "faixa azul";
      case "roxa": return "faixa roxa";
      case "marrom": return "faixa marrom";
      case "preta": return "faixa preta";
      default: return "faixa";
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
          <option value="ARQUIVADO">Arquivados</option>
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
                  <td className="nome-aluno">{professor.nome}</td>

                  <td>
                    <span className={getFaixaClass(professor.faixa)}>
                      {professor.faixa || "—"}
                    </span>
                  </td>

                  <td>{professor.grau ?? 0}</td>

                  <td>{professor.frequencia ?? 0}</td>

                  <td>
                    <span
                      className={
                        professor.arquivado_at
                          ? "status arquivado"
                          : professor.status === "ENABLED"
                            ? "status ativo"
                            : professor.status === "DISMISSED"
                              ? "status desligado"
                              : "status inativo"
                      }
                    >
                      {professor.arquivado_at
                        ? "Arquivado"
                        : statusLabel(professor.status)}
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
                    <button
                      className="icon-btn delete"
                      onClick={() =>
                        abrirConfirmacaoExclusao(professor)
                      }
                    >
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

      {confirmModalOpen && selectedProfessorParaExcluir && (
        <ConfirmModal
          title="Confirmar exclusão"
          message={`Deseja realmente excluir ${selectedProfessorParaExcluir.nome}?`}
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={handleExcluirProfessor}
          onCancel={fecharConfirmacao}
        />
      )}
    </div>
  );
}

export default ListarProfessores;
