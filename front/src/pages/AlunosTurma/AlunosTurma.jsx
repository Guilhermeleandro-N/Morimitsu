import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { listarAlunosDaTurma, removerAlunoDaTurma, atualizarStatusAlunoNaTurma } from "../../services/turmaService";
import { BuscarAlunoCompletoPorUserId } from "../../services/alunoService";
import FrequenciaModal from "../../components/RegistrarFrequencia/FrequenciaModal";

import {
  FaEye,
  FaTrash,
  FaArchive,
  FaUserPlus,
  FaClipboardCheck,
  FaHistory
} from "react-icons/fa";

import "./AlunosTurma.css";
import AdicionarAlunoTurmaModal from "../../components/AdicionarAlunoTurma/AdicionarAlunoTurmaModal";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";

function AlunosTurma() {

  const navigate = useNavigate();
  const location = useLocation();

  const turmaId = location.state?.turmaId;
  const turmaNome = location.state?.turmaNome;
  
  const turmaHorarioInicio = location.state?.turmaHorarioInicio;
  const turmaHorarioFim = location.state?.turmaHorarioFim;
  const [alunos, setAlunos] = useState([]);
  const [modalAdicionarOpen, setModalAdicionarOpen] =
    useState(false);

  const [modalFrequenciaOpen, setModalFrequenciaOpen] =
  useState(false);
  const [confirmModalOpen, setConfirmModalOpen] =
    useState(false);
  const [selectedAlunoParaRemover, setSelectedAlunoParaRemover] =
    useState(null);

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
              ...aluno,
              ...alunoCompleto
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

  function getFaixaClass(faixa) {

    switch (faixa?.toLowerCase()) {

      case "branca":
        return "faixa branca";

      case "amarela":
        return "faixa amarela";

      case "laranja":
        return "faixa laranja";

      case "verde":
        return "faixa verde";

      case "azul":
        return "faixa azul";

      default:
        return "faixa";
    }
  }

  return (

    <div className="listar-container">

      <div className="page-header">

        <div>

          <h1>Lista de Alunos</h1>

          <p>
            Gerenciar alunos da turma {turmaNome}
          </p>

        </div>

        <div className="header-actions">

          <button
            className="header-btn"
            onClick={() =>
              setModalAdicionarOpen(true)
            }
          >
            <FaUserPlus />
          </button>

        <button
          className="header-btn"
          onClick={() =>
            setModalFrequenciaOpen(true)
          }
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

      </div>

      <div className="listar-card">

        <div className="listar-header">

          <h2>{turmaNome}</h2>

          <p>
            Total de {alunos.length} alunos nesta turma
          </p>

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

              {alunos.map((aluno) => (

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

                    <span
                      className={
                        aluno.frequente === "S"
                          ? "status ativo"
                          : "status inativo"
                      }
                    >
                      {aluno.frequente === "S"
                        ? "Ativo"
                        : "Inativo"}
                    </span>

                  </td>

                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => handleToggleStatus(aluno)}
                      title={aluno.frequente === "S" ? "Inativar aluno" : "Ativar aluno"}
                    >
                      <FaArchive
                        style={{ color: aluno.frequente === "S" ? "#f59e0b" : "#6b7280" }}
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

              {alunos.length === 0 && (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "20px"
                    }}
                  >
                    Nenhum aluno encontrado.
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
    onSalvar={(presentes) => {
      console.log(
        "Alunos presentes:",
        presentes
      );

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