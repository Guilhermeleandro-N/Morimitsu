import React, { useEffect, useState } from "react";
import { listarAlunosCompleto, deletarAluno } from "../../services/alunoService";
import { arquivarUsuario } from "../../services/userService";
import { listarPerfisDoUsuario } from "../../services/authorizationService";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash, FaArchive } from "react-icons/fa";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { useToast } from "../../context/ToastContext";

import "./ListarAlunos.css";

const ListarAluno = () => {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("TODOS");
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedAlunoParaExcluir, setSelectedAlunoParaExcluir] = useState(null);
  const { addToast } = useToast();

  function abrirPerfil(userId) {
    navigate("/perfilAluno", { state: { id: userId } });
  }

  async function handleArquivar(aluno) {
    const arquivado = !aluno.usuario?.arquivado_at;
    try {
      await arquivarUsuario(aluno.usuarioId, arquivado);
      setAlunos((prev) =>
        prev
          .map((a) =>
            a.id === aluno.id
              ? {
                  ...a,
                  usuario: {
                    ...a.usuario,
                    arquivado_at: arquivado ? new Date().toISOString() : null,
                  },
                }
              : a
          )
          .sort((x, y) => {
            if (!!x.usuario?.arquivado_at !== !!y.usuario?.arquivado_at) {
              return x.usuario?.arquivado_at ? 1 : -1;
            }
            return 0;
          })
      );
      addToast(
        arquivado
          ? "Aluno arquivado com sucesso!"
          : "Aluno reativado com sucesso!",
        "success"
      );
    } catch (error) {
      console.error("Erro ao arquivar:", error);
      addToast("Erro ao arquivar aluno.", "error");
    }
  }

  function abrirConfirmacaoExclusao(aluno) {
    setSelectedAlunoParaExcluir(aluno);
    setConfirmModalOpen(true);
  }

  async function handleExcluirAluno() {
    if (!selectedAlunoParaExcluir) {
      return;
    }

    try {
      await deletarAluno(selectedAlunoParaExcluir.id);
      setAlunos((prevAlunos) =>
        prevAlunos.filter(
          (aluno) => aluno.id !== selectedAlunoParaExcluir.id,
        ),
      );
      addToast("Aluno excluído com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      addToast("Erro ao excluir aluno.", "error");
    } finally {
      setConfirmModalOpen(false);
      setSelectedAlunoParaExcluir(null);
    }
  }

  function fecharConfirmacao() {
    setConfirmModalOpen(false);
    setSelectedAlunoParaExcluir(null);
  }

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const response = await listarAlunosCompleto();

        // Filtra administradores da lista de alunos
        const alunosSemAdmin = [];
        for (const aluno of response) {
          if (!aluno.usuario) {
            alunosSemAdmin.push(aluno);
            continue;
          }
          try {
            const perfis = await listarPerfisDoUsuario(aluno.usuario.id);
            const isAdmin = perfis.some((p) => p.nome?.toLowerCase() === "admin");
            if (!isAdmin) alunosSemAdmin.push(aluno);
          } catch {
            alunosSemAdmin.push(aluno);
          }
        }

        setAlunos(alunosSemAdmin);
      } catch (error) {
        console.log("Erro ao carregar alunos:", error);
      }
    }
    carregarAlunos();
  }, []);

  const alunosFiltrados =
    filtroStatus === "TODOS"
      ? alunos.filter((a) => a.usuario)
      : filtroStatus === "ARQUIVADO"
        ? alunos.filter((a) => a.usuario && a.usuario.arquivado_at)
        : alunos.filter(
            (a) =>
              a.usuario &&
              a.usuario.status === filtroStatus &&
              !a.usuario.arquivado_at,
          );

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
          <h1>Lista de Alunos</h1>
          <p>Alunos cadastrados na plataforma</p>
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
          <h2>Alunos</h2>
          <p>Total de {alunosFiltrados.length} alunos</p>
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
              {alunosFiltrados.map((aluno) => (
                <tr key={aluno.id}>
                  <td className="nome-aluno">{aluno.usuario?.nome ?? "—"}</td>
                  <td>
                    <span className={getFaixaClass(aluno.faixa)}>{aluno.faixa}</span>
                  </td>
                  <td>{aluno.grau_faixa}</td>
                  <td>{aluno.frequencia_atual}</td>
                  <td>
                    <span
                      className={
                        aluno.usuario?.arquivado_at
                          ? "status arquivado"
                          : aluno.usuario?.status === "ENABLED"
                            ? "status ativo"
                            : "status inativo"
                      }
                    >
                      {aluno.usuario?.arquivado_at
                        ? "Arquivado"
                        : aluno.usuario?.status === "ENABLED"
                          ? "Ativo"
                          : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => handleArquivar(aluno)}>
                      <FaArchive />
                    </button>
                  </td>
                  <td>
                    <button
                      className="icon-btn delete"
                      onClick={() => abrirConfirmacaoExclusao(aluno)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                  <td>
                    <button className="perfil-btn" onClick={() => abrirPerfil(aluno.usuario?.id)}>
                      <FaEye /> Ver Perfil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirmModalOpen && selectedAlunoParaExcluir && (
        <ConfirmModal
          title="Confirmar exclusão"
          message={`Deseja realmente excluir ${selectedAlunoParaExcluir.usuario?.nome ?? "este aluno"}?`}
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={handleExcluirAluno}
          onCancel={fecharConfirmacao}
        />
      )}
    </div>
  );
};

export default ListarAluno;
