import React, { useEffect, useState } from "react";
import { listarTurmas } from "../../services/turmaService";
import { FaClock, FaChalkboardTeacher, FaCalendarDay } from "react-icons/fa";
import "./MeusTreinos.css";

const DIAS = [
  { key: "domingo", nome: "DOM", idx: 0 },
  { key: "segunda", nome: "SEG", idx: 1 },
  { key: "terca", nome: "TER", idx: 2 },
  { key: "quarta", nome: "QUA", idx: 3 },
  { key: "quinta", nome: "QUI", idx: 4 },
  { key: "sexta", nome: "SEX", idx: 5 },
  { key: "sabado", nome: "SAB", idx: 6 },
];

function MeusTreinos() {
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const hoje = new Date();

  function formatarHorario(data) {
    return new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  }

  function formatarDataProxima(data) {
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  function obterDiasAtivos(turma) {
    return DIAS.filter((d) => turma[d.key]);
  }

  // Calcula o próximo dia de treino da turma a partir de hoje.
  // Retorna { offset, data, label } ou null se a turma não tem dias.
  function obterProximoTreino(turma) {
    const diasAtivos = obterDiasAtivos(turma);
    if (diasAtivos.length === 0) return null;

    const diaHoje = hoje.getDay();

    for (let offset = 0; offset < 7; offset++) {
      const diaAlvo = (diaHoje + offset) % 7;
      const ativo = diasAtivos.find((d) => d.idx === diaAlvo);
      if (ativo) {
        const data = new Date(hoje);
        data.setDate(hoje.getDate() + offset);

        let label;
        if (offset === 0) label = "Hoje";
        else if (offset === 1) label = "Amanhã";
        else label = `Em ${offset} dias`;

        return { offset, data, label, ativo };
      }
    }

    return null;
  }

  function formatarPlural(numero) {
    return numero === 1 ? "dia" : "dias";
  }

  useEffect(() => {
    async function carregar() {
      try {
        const turmasResponse = await listarTurmas();
        setTurmas(Array.isArray(turmasResponse) ? turmasResponse : []);
      } catch (error) {
        console.error("Erro ao carregar meus treinos:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando) {
    return (
      <div className="treinos-container">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="treinos-container">
      <div className="treinos-header">
        <div>
          <h1>Meus Treinos</h1>
          <p>Veja os dias das suas aulas e quando é o próximo treino</p>
        </div>
      </div>

      {turmas.length === 0 ? (
        <div className="treinos-empty">
          <p>Você não está vinculado a nenhuma turma no momento.</p>
        </div>
      ) : (
        <div className="treinos-grid">
          {turmas.map((turma) => {
            const proximo = obterProximoTreino(turma);
            const diasAtivos = obterDiasAtivos(turma);

            return (
              <div className="treino-card" key={turma.id}>
                <div className="treino-card-header">
                  <h3 title={turma.nome}>{turma.nome}</h3>
                  {turma.professores?.length > 0 && (
                    <span className="treino-professor" title={turma.professores.join(", ")}>
                      <FaChalkboardTeacher />
                      <span className="treino-professor-nome">
                        {turma.professores.join(", ")}
                      </span>
                    </span>
                  )}
                </div>

                <div className="treino-info">
                  <p className="treino-horario">
                    <FaClock /> {formatarHorario(turma.horario_inicio)} -{" "}
                    {formatarHorario(turma.horario_fim)}
                  </p>
                </div>

                {/* Agenda semanal com destaque para hoje */}
                <div className="treino-semana">
                  {DIAS.map((d) => {
                    const ativo = diasAtivos.some((a) => a.idx === d.idx);
                    const ehHoje = d.idx === hoje.getDay();
                    const classe = [
                      "dia-semana",
                      ativo ? "ativo" : "",
                      ehHoje ? "hoje" : "",
                      ativo && ehHoje ? "dia-atual" : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <div className={classe} key={d.key}>
                        <span className="dia-nome">{d.nome}</span>
                        {ativo && <span className="dia-ponto" />}
                      </div>
                    );
                  })}
                </div>

                {/* Próximo treino */}
                {proximo ? (
                  <div className="proximo-treino">
                    <div className="proximo-icon">
                      <FaCalendarDay />
                    </div>
                    <div className="proximo-info">
                      <span className="proximo-label">
                        Próximo treino
                      </span>
                      <strong className="proximo-data">
                        {proximo.label} · {formatarDataProxima(proximo.data)}
                      </strong>
                      <span className="proximo-desc">
                        {proximo.offset === 0
                          ? "Você tem aula hoje"
                          : `Faltam ${proximo.offset} ${formatarPlural(
                              proximo.offset
                            )} para a sua aula`}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="proximo-treino sem-dias">
                    <span className="proximo-label">
                      Esta turma não possui dias de treino definidos.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MeusTreinos;
