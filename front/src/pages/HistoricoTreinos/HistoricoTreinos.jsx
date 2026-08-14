import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { listarAlunosDaTurma } from "../../services/turmaService";
import { BuscarAlunoCompletoPorUserId } from "../../services/alunoService";
import { listarFrequenciasTurma } from "../../services/frequenciaService";
import { FaArrowLeft, FaCalendarCheck, FaChevronRight } from "react-icons/fa";
import "./HistoricoTreinos.css";
import { editarFrequencia } from "../../services/frequenciaService";
import { useToast } from "../../context/ToastContext";

function HistoricoTreinos() {
  const navigate = useNavigate();
  const location = useLocation();

  const turmaId = location.state?.turmaId;
  const turmaNome = location.state?.turmaNome;

  const [alunos, setAlunos] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    if (!turmaId) return;
    carregarDados();
  }, [turmaId]);

  async function alterarStatus(freq) {

  const novoStatus =
    freq.status_presenca === "PRESENTE"
      ? "AUSENTE"
      : "PRESENTE";

  try {

    await editarFrequencia(
      freq.id,
      {
        status_presenca: novoStatus,
        data: freq.data,
        horario_inicio: freq.horario_inicio,
        horario_fim: freq.horario_fim,
      }
    );

    // Atualiza o estado local
    setTreinos((treinosAnteriores) => {

      const novosTreinos = treinosAnteriores.map((treino) => {

        if (treino.data !== treinoSelecionado.data)
          return treino;

const novasPresencas = treino.presencas.map((aluno) => {

  const novasFrequencias = aluno.frequencias.map((f) =>
    f.id === freq.id
      ? {
          ...f,
          status_presenca: novoStatus,
        }
      : f
  );

  return {
    ...aluno,
    frequencias: novasFrequencias,
  };

});

const totalPresentes = novasPresencas.filter((aluno) =>
  aluno.frequencias.some(
    (f) => f.status_presenca === "PRESENTE"
  )
).length;

return {
  ...treino,
  presencas: novasPresencas,
  totalPresentes,
};

      });

      // Atualiza também o treino exibido à direita
      const treinoAtualizado =
        novosTreinos.find(
          (t) => t.data === treinoSelecionado.data
        );

      setTreinoSelecionado(treinoAtualizado);

      return novosTreinos;

    });

  } catch (error) {

    console.error(error);
    addToast("Erro ao atualizar frequência.", "error");

  }

}

  async function carregarDados() {
    try {
      setCarregando(true);

      const [alunosTurma, frequencias] = await Promise.all([
        listarAlunosDaTurma(turmaId),
        listarFrequenciasTurma(turmaId),
      ]);

      const alunosCompletos = await Promise.all(
        alunosTurma.map(async (aluno) => {
          const alunoCompleto = await BuscarAlunoCompletoPorUserId(
            aluno.usuarioId,
          );
          return { ...aluno, ...alunoCompleto };
        }),
      );

      const alunosAtivos = alunosCompletos.filter((a) => a.frequente === "S");

      setAlunos(alunosAtivos);

      const treinosAgrupados = agruparPorData(frequencias, alunosAtivos);
      setTreinos(treinosAgrupados);

      if (treinosAgrupados.length > 0) {
        setTreinoSelecionado(treinosAgrupados[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    } finally {
      setCarregando(false);
    }
  }

  function agruparPorData(frequencias, alunosAtivos) {
    const mapa = {};

    frequencias.forEach((freq) => {
      const dataStr = new Date(freq.data).toISOString().split("T")[0];

      if (!mapa[dataStr]) {
        mapa[dataStr] = {
          data: dataStr,
          frequencias: [],
        };
      }

      mapa[dataStr].frequencias.push(freq);
    });

    const treinosArray = Object.values(mapa).sort(
      (a, b) => new Date(b.data) - new Date(a.data),
    );

    return treinosArray.map((treino) => {
      const frequenciasPorAluno = {};

      treino.frequencias.forEach((freq) => {

        if (!frequenciasPorAluno[freq.aluno_id]) {

          frequenciasPorAluno[freq.aluno_id] = [];

        }

        frequenciasPorAluno[freq.aluno_id].push(freq);

      });

      const presencas = alunosAtivos.map((aluno) => ({

        ...aluno,

        frequencias:
          frequenciasPorAluno[aluno.id] || []

      }));

      const totalPresentes = presencas.filter((aluno) =>
        aluno.frequencias.some(
          (freq) => freq.status_presenca === "PRESENTE"
        )
      ).length;

      return {
        ...treino,
        presencas,
        totalPresentes,
        totalAlunos: alunosAtivos.length,
      };
    });
  }

  function formatarData(dataStr) {
    return new Date(dataStr + "T00:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  function formatarDataExtenso(dataStr) {
    return new Date(dataStr + "T00:00:00").toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  if (!turmaId) {
    return (
      <div className="historico-container">
        <p>Turma não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="historico-container">
      <div className="historico-header">
        <button
          className="back-btn"
          onClick={() =>
            navigate("/alunosTurma", {
              state: { turmaId, turmaNome },
            })
          }
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1>Histórico de Treinos</h1>
        </div>
      </div>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <div className="historico-content">
          {/* Painel esquerdo - Lista de treinos */}
          <div className="treinos-panel">
            <h2>
              {turmaNome} • {treinos.length}{" "}
              {treinos.length === 1 ? "treino" : "treinos"}
            </h2>

            {treinos.length === 0 ? (
              <p
                style={{ color: "#999", textAlign: "center", padding: "20px" }}
              >
                Nenhum treino registrado para esta turma.
              </p>
            ) : (
              <div className="treinos-list">
                {treinos.map((treino) => (
                  <div
                    key={treino.data}
                    className={`treino-item ${treinoSelecionado?.data === treino.data ? "selected" : ""
                      }`}
                    onClick={() => setTreinoSelecionado(treino)}
                  >
                    <div className="treino-item-info">
                      <div className="treino-icon">
                        <FaCalendarCheck />
                      </div>
                      <div>
                        <div className="treino-data">
                          Treino ({formatarData(treino.data)})
                        </div>
                        <div className="treino-presencas">
                          {treino.totalPresentes}/{treino.totalAlunos} presentes
                        </div>
                      </div>
                    </div>
                    <FaChevronRight className="treino-chevron" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="presencas-panel">
            {treinoSelecionado ? (
              <>
                <h2>Presenças</h2>
                <p className="subtitulo">
                  Treino do dia {formatarDataExtenso(treinoSelecionado.data)} •{" "}
                  {treinoSelecionado.totalPresentes} presente
                  {treinoSelecionado.totalPresentes !== 1 ? "s" : ""} de{" "}
                  {treinoSelecionado.totalAlunos} aluno
                  {treinoSelecionado.totalAlunos !== 1 ? "s" : ""}
                </p>

                <div className="table-container">
                  <table className="tabela-presencas">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Status</th>
                        <th>Frequência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {treinoSelecionado.presencas.map((aluno) => (
                        <tr key={aluno.id}>
                          <td className="nome-aluno">{aluno.nome}</td>
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
                            {aluno.frequencias.length === 0 ? (
                              <span className="presenca-badge ausente">
                                Sem frequência
                              </span>
                            ) : (
                              aluno.frequencias.map((freq) => (
                                <div
                                  key={freq.id}
                                  className="frequencia-card"
                                >
                                  <div className="frequencia-info">

                                    <span className="frequencia-horario">
                                      {new Date(freq.horario_inicio).toLocaleTimeString(
                                        "pt-BR",
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )}
                                      {" - "}
                                      {new Date(freq.horario_fim).toLocaleTimeString(
                                        "pt-BR",
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        }
                                      )}
                                    </span>

                                    <span
                                      className={`presenca-badge ${freq.status_presenca === "PRESENTE"
                                          ? "presente"
                                          : "ausente"
                                        }`}
                                    >
                                      {freq.status_presenca}
                                    </span>

                                  </div>

                                  <label className="toggle-switch">
                                    <input
                                      type="checkbox"
                                      checked={
                                        freq.status_presenca === "PRESENTE"
                                      }
                                      onChange={() =>
                                        alterarStatus(freq)
                                      }
                                    />
                                    <span className="toggle-slider"></span>
                                  </label>
                                </div>
                              ))
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="presencas-empty">
                <div className="empty-icon">📋</div>
                <p>Selecione um treino para ver as presenças</p>
                <p className="empty-hint">
                  Clique em uma data no painel ao lado
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoricoTreinos;