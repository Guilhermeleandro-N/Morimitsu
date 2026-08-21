import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { listarAlunosDaTurma, removerAlunoDaTurma, atualizarStatusAlunoNaTurma, atualizarArquivadoAlunoNaTurma, atualizarStatusTurma } from "../../services/turmaService";
import { BuscarAlunoCompletoPorUserId } from "../../services/alunoService";
import FrequenciaModal from "../../components/RegistrarFrequencia/FrequenciaModal";
import RoleGuard from "../../routes/RoleGuard";
import {
  FaEye,
  FaTrash,
  FaArchive,
  FaUserPlus,
  FaClipboardCheck,
  FaHistory,
  FaArrowLeft
} from "react-icons/fa";

import "./AlunosTurma.css";
import AdicionarAlunoTurmaModal from "../../components/AdicionarAlunoTurma/AdicionarAlunoTurmaModal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

const FAIXAS = [
  "BRANCA",
  "CINZA",
  "AMARELA",
  "LARANJA",
  "VERDE",
  "AZUL",
  "ROXA",
  "MARROM",
  "PRETA",
];

const FILTRO_STATUS = {
  TODOS: "TODOS",
  ATIVOS: "ATIVOS",
  INATIVOS: "INATIVOS",
  ARQUIVADOS: "ARQUIVADOS",
};

function AlunosTurma() {

  const navigate = useNavigate();
  const location = useLocation();

  const turmaId = location.state?.turmaId;
  const turmaNome = location.state?.turmaNome;
  
  const turmaHorarioInicio = location.state?.turmaHorarioInicio;
  const turmaHorarioFim = location.state?.turmaHorarioFim;

  const [statusTurma, setStatusTurma] = useState(
    location.state?.turmaStatus || "ATIVO"
  );

  const [alunos, setAlunos] = useState([]);
  const [modalAdicionarOpen, setModalAdicionarOpen] =
    useState(false);

  const [modalFrequenciaOpen, setModalFrequenciaOpen] =
  useState(false);
  const [confirmModalOpen, setConfirmModalOpen] =
    useState(false);
  const [selectedAlunoParaRemover, setSelectedAlunoParaRemover] =
    useState(null);

  const [filtroStatus, setFiltroStatus] = useState(FILTRO_STATUS.TODOS);
  const [filtroFaixa, setFiltroFaixa] = useState("");
  const [filtroGrau, setFiltroGrau] = useState("");

  function abrirPerfil(userId) {
    navigate("/perfilAluno", {
      state: {
        id: userId,
      },
    });
  }

  async function carregarAlunos() {
    try {

      const alunosTurma =
        await listarAlunosDaTurma(turmaId);

      const alunosCompletos =
        await Promise.all(
          alunosTurma.map(async (aluno) => {

            const alunoCompleto =
              await BuscarAlunoCompletoPorUserId(
                aluno.usuarioId
              );

            return {
              ...alunoCompleto,
              ...aluno,
              frequencia_atual: aluno.frequencia_atual,
            };

          })
        );

      console.log(
        "Alunos completos:",
        alunosCompletos
      );

      setAlunos(alunosCompletos);

    } catch (error) {

      console.error(
        "Erro ao carregar alunos:",
        error
      );

    }
  }

  async function handleToggleStatus(aluno) {
    const novoStatus = aluno.frequente === "S" ? "N" : "S";
    try {
      await atualizarStatusAlunoNaTurma(turmaId, aluno.id, novoStatus);
      setAlunos((prev) =>
        prev.map((a) =>
          a.id === aluno.id ? { ...a, frequente: novoStatus } : a
        )
      );
    } catch (error) {
      console.error("Erro ao alternar status do aluno:", error);
    }
  }

  async function handleToggleArquivado(aluno) {
    const arquivado = !aluno.arquivado_at;
    try {
      await atualizarArquivadoAlunoNaTurma(turmaId, aluno.id, arquivado);
      setAlunos((prev) =>
        prev.map((a) =>
          a.id === aluno.id
            ? { ...a, arquivado_at: arquivado ? new Date().toISOString() : null }
            : a
        )
      );
    } catch (error) {
      console.error("Erro ao arquivar/reativar aluno:", error);
    }
  }

  async function handleToggleStatusTurma() {
    const novoStatus = statusTurma === "ATIVO" ? "INATIVO" : "ATIVO";
    try {
      await atualizarStatusTurma(turmaId, novoStatus);
      setStatusTurma(novoStatus);
    } catch (error) {
      console.error("Erro ao alternar status da turma:", error);
    }
  }

  function abrirConfirmacaoRemocao(aluno) {
    setSelectedAlunoParaRemover(aluno);
    setConfirmModalOpen(true);
  }

  async function handleRemoverAluno() {
    if (!selectedAlunoParaRemover) {
      return;
    }

    try {
      await removerAlunoDaTurma(
        turmaId,
        selectedAlunoParaRemover.id,
      );
      setAlunos((prevAlunos) =>
        prevAlunos.filter(
          (aluno) => aluno.id !== selectedAlunoParaRemover.id,
        ),
      );
    } catch (error) {
      console.error(
        "Erro ao remover aluno da turma:",
        error,
      );
    } finally {
      setConfirmModalOpen(false);
      setSelectedAlunoParaRemover(null);
    }
  }

  function fecharConfirmacao() {
    setConfirmModalOpen(false);
    setSelectedAlunoParaRemover(null);
  }

  useEffect(() => {

    if (turmaId) {
      carregarAlunos();
    }

  }, [turmaId]);

  const grausDisponiveis = useMemo(() => {
    return [0, 1, 2, 3, 4];
  }, []);

  const alunosFiltrados = useMemo(() => {
    let lista = alunos;

    if (filtroStatus === FILTRO_STATUS.ATIVOS) {
      lista = lista.filter((a) => a.frequente === "S" && !a.arquivado_at);
    } else if (filtroStatus === FILTRO_STATUS.INATIVOS) {
      lista = lista.filter((a) => a.frequente === "N" && !a.arquivado_at);
    } else if (filtroStatus === FILTRO_STATUS.ARQUIVADOS) {
      lista = lista.filter((a) => a.arquivado_at);
    } else {
      lista = lista.filter((a) => !a.arquivado_at);
    }

    if (filtroFaixa) {
      lista = lista.filter((a) => a.faixa === filtroFaixa);
    }

    if (filtroGrau !== "") {
      lista = lista.filter((a) => String(a.grau_faixa) === filtroGrau);
    }

    return lista;
  }, [alunos, filtroStatus, filtroFaixa, filtroGrau]);

  function getFaixaClass(faixa) {

    switch (faixa?.toLowerCase()) {

      case "branca":
        return "faixa branca";

      case "cinza":
        return "faixa cinza";

      case "amarela":
        return "faixa amarela";

      case "laranja":
        return "faixa laranja";

      case "verde":
        return "faixa verde";

      case "azul":
        return "faixa azul";

      case "roxa":
        return "faixa roxa";

      case "marrom":
        return "faixa marrom";

      case "preta":
        return "faixa preta";

      default:
        return "faixa";
    }
  }

  return (

    <div className="listar-container">

      <div className="page-header">

        <div className="page-header-left">

          <button
            className="back-btn"
            onClick={() =>
              navigate("/turmas")
            }
            title="Voltar para turmas"
          >
            <FaArrowLeft />
          </button>

          <div>

            <h1>Lista de Alunos</h1>

            <p>
              Gerenciar alunos da turma {turmaNome}
            </p>

          </div>

        </div>
        <RoleGuard allowedRoutes={["admin", "professor"]}>
        <div className="header-actions">

          <button
            className="header-btn"
            onClick={() =>
              setModalAdicionarOpen(true)
            }
            title="Adicionar aluno à turma"
          >
            <FaUserPlus />
          </button>

        <button
          className="header-btn"
          onClick={() =>
            setModalFrequenciaOpen(true)
          }
          title="Registrar frequência"
        >
          <FaClipboardCheck />
        </button>

        <button
          className="header-btn"
          onClick={() =>
            navigate("/historicoTreinos", {
              state: {
                turmaId,
                turmaNome,
              },
            })
          }
          title="Histórico de Treinos"
        >
          <FaHistory />
        </button>

        </div>
      </RoleGuard>    
      </div>

      <div className="listar-card">

        <div className="listar-header">

          <div className="listar-header-left">
            <h2>{turmaNome}</h2>
            <p>
              Total de {alunosFiltrados.length} alunos nesta turma
            </p>
          </div>

          <div className="listar-header-right">

            <div className="filtros-bar">

              <select
                className="filtro-select"
                value={filtroStatus}
                onChange={(e) =>
                  setFiltroStatus(e.target.value)
                }
                title="Filtrar por status"
              >
                <option value={FILTRO_STATUS.TODOS}>Todos</option>
                <option value={FILTRO_STATUS.ATIVOS}>Ativos</option>
                <option value={FILTRO_STATUS.INATIVOS}>Inativos</option>
                <option value={FILTRO_STATUS.ARQUIVADOS}>Arquivados</option>
              </select>

              <select
                className="filtro-select"
                value={filtroFaixa}
                onChange={(e) =>
                  setFiltroFaixa(e.target.value)
                }
                title="Filtrar por faixa"
              >
                <option value="">Todas as faixas</option>
                {FAIXAS.map((faixa) => (
                  <option key={faixa} value={faixa}>
                    {faixa.charAt(0) + faixa.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>

              <select
                className="filtro-select"
                value={filtroGrau}
                onChange={(e) =>
                  setFiltroGrau(e.target.value)
                }
                title="Filtrar por grau"
              >
                <option value="">Todos os graus</option>
                {grausDisponiveis.map((grau) => (
                  <option key={grau} value={String(grau)}>
                    Grau {grau}
                  </option>
                ))}
              </select>

            </div>

            <RoleGuard allowedRoutes={["admin"]}>
              <button
                className={`turma-status-btn ${statusTurma === "ATIVO" ? "status-ativo" : "status-inativo"}`}
                onClick={handleToggleStatusTurma}
                title={statusTurma === "ATIVO" ? "Clique para inativar" : "Clique para ativar"}
              >
                {statusTurma === "ATIVO" ? "Ativo" : "Inativo"}
              </button>
            </RoleGuard>

          </div>

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

                  <td className="nome-aluno">
                    {aluno.nome}
                  </td>

                  <td>
                    <span
                      className={getFaixaClass(
                        aluno.faixa
                      )}
                    >
                      {aluno.faixa}
                    </span>
                  </td>

                  <td>
                    {aluno.grau_faixa}
                  </td>

                  <td>
                    {aluno.frequencia_atual}
                  </td>

                  <td>

                    <button
                      type="button"
                      className={`status-btn ${
                        aluno.arquivado_at
                          ? "status-arquivado"
                          : aluno.frequente === "S"
                            ? "status-ativo"
                            : "status-inativo"
                      }`}
                      onClick={() => handleToggleStatus(aluno)}
                      title={aluno.arquivado_at ? "Arquivado" : aluno.frequente === "S" ? "Clique para inativar" : "Clique para ativar"}
                    >
                      {aluno.arquivado_at
                        ? "Arquivado"
                        : aluno.frequente === "S"
                          ? "Ativo"
                          : "Inativo"}
                    </button>

                  </td>

                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => handleToggleArquivado(aluno)}
                      title={aluno.arquivado_at ? "Reativar aluno" : "Arquivar aluno"}
                    >
                      <FaArchive
                        style={{ color: aluno.arquivado_at ? "#dc2626" : "#6b7280" }}
                      />
                    </button>
                  </td>

                  <td>

                    <button
                      className="icon-btn delete"
                      onClick={() =>
                        abrirConfirmacaoRemocao(aluno)
                      }
                    >
                      <FaTrash />
                    </button>

                  </td>

                  <td>

                    <button
                      className="perfil-btn"
                      onClick={() =>
                        abrirPerfil(
                          aluno.usuarioId
                        )
                      }
                    >
                      <FaEye />
                      Ver Perfil
                    </button>

                  </td>

                </tr>

              ))}

              {alunosFiltrados.length === 0 && (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "20px"
                    }}
                  >
                    {filtroStatus === FILTRO_STATUS.ARQUIVADOS
                      ? "Nenhum aluno arquivado."
                      : "Nenhum aluno encontrado."}
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {modalAdicionarOpen && (

        <AdicionarAlunoTurmaModal
          turmaId={turmaId}
          turmaNome={turmaNome}
          onClose={() =>
            setModalAdicionarOpen(false)
          }
          onAlunoAdicionado={async () => {

            await carregarAlunos();

            setModalAdicionarOpen(false);

          }}
        />

      )}

      {modalFrequenciaOpen && (
  <FrequenciaModal
    alunos={alunos}
    turmaId={turmaId}
    onClose={() =>
      setModalFrequenciaOpen(false)
    }
    onSalvar={async (presentes) => {
      await carregarAlunos();
      setModalFrequenciaOpen(false);
    }}
  />
)}

      {confirmModalOpen && selectedAlunoParaRemover && (
        <ConfirmModal
          title="Confirmar exclusão"
          message={`Deseja realmente remover ${selectedAlunoParaRemover.nome} desta turma?`}
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={handleRemoverAluno}
          onCancel={fecharConfirmacao}
        />
      )}

    </div>

  );

}

export default AlunosTurma;
