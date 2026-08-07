import React, { useEffect, useState } from "react";
import "./TurmasArquivadas.css";
import {
  listarTurmasArquivadas,
  reativarTurma,
  excluirTurma,
} from "../../services/turmaService";
import { Archive, RotateCcw, Trash2, CalendarClock } from "lucide-react";

function TurmasArquivadas() {
  const [turmas, setTurmas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarTurmas = async () => {
    setCarregando(true);
    setErro("");
    try {
      const response = await listarTurmasArquivadas();
      setTurmas(Array.isArray(response) ? response : []);
    } catch (error) {
      setErro(
        error?.response?.data?.message ||
          "Erro ao carregar turmas arquivadas.",
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const response = await listarTurmasArquivadas();
        if (ativo) setTurmas(Array.isArray(response) ? response : []);
      } catch (error) {
        if (ativo)
          setErro(
            error?.response?.data?.message ||
              "Erro ao carregar turmas arquivadas.",
          );
      } finally {
        if (ativo) setCarregando(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  const formatarHorario = (data) =>
    new Date(data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });

  const formatarDataArquivada = (data) => {
    if (!data) return "--";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const obterDiasSemana = (turma) => {
    const dias = [];
    if (turma.segunda) dias.push("SEG");
    if (turma.terca) dias.push("TER");
    if (turma.quarta) dias.push("QUA");
    if (turma.quinta) dias.push("QUI");
    if (turma.sexta) dias.push("SEX");
    if (turma.sabado) dias.push("SAB");
    if (turma.domingo) dias.push("DOM");
    return dias.join(" • ");
  };

  const handleReativar = async (id) => {
    try {
      await reativarTurma(id);
      await carregarTurmas();
    } catch (error) {
      setErro(error?.response?.data?.message || "Erro ao reativar turma.");
    }
  };

  const handleExcluir = async (turma) => {
    const confirmou = window.confirm(
      `Excluir permanentemente a turma "${turma.nome}"? Essa ação não pode ser desfeita.`,
    );
    if (!confirmou) return;
    try {
      await excluirTurma(turma.id);
      await carregarTurmas();
    } catch (error) {
      setErro(error?.response?.data?.message || "Erro ao excluir turma.");
    }
  };

  return (
    <div className="turmas-container">
      <div className="turmas-header">
        <div>
          <h1>Turmas Arquivadas</h1>
          <p>Turmas inativas ou arquivadas</p>
        </div>
      </div>

      {erro && <div className="arquivadas-erro">{erro}</div>}

      {carregando ? (
        <p className="arquivadas-vazio">Carregando turmas arquivadas...</p>
      ) : turmas.length === 0 ? (
        <div className="arquivadas-vazio">
          <Archive size={48} />
          <p>Nenhuma turma arquivada no momento.</p>
        </div>
      ) : (
        <div className="turmas-grid">
          {turmas.map((turma) => (
            <div className="turma-card arquivada-card" key={turma.id}>
              <div className="turma-banner">
                <div>
                  <div className="turma-title-row">
                    <h3>{turma.nome}</h3>
                    <span className="status-badge status-arquivada"></span>
                  </div>
                  <span>
                    {formatarHorario(turma.horario_inicio)}
                    {" - "}
                    {formatarHorario(turma.horario_fim)}
                    {turma.professores?.length > 0 && (
                      <span className="turma-professor">
                        {" • Prof.: "}
                        {turma.professores.join(", ")}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              <div className="turma-content">
                <div className="dias-container">{obterDiasSemana(turma)}</div>
                <div className="arquivada-info">
                  <CalendarClock size={16} />
                  <span>
                    Arquivada em{" "}
                    {formatarDataArquivada(turma.arquivada_em)}
                  </span>
                </div>
              </div>

              <div className="arquivada-actions">
                <button
                  className="btn-reativar"
                  onClick={() => handleReativar(turma.id)}
                >
                  <RotateCcw size={18} /> Reativar
                </button>
                <button
                  className="btn-excluir"
                  onClick={() => handleExcluir(turma)}
                >
                  <Trash2 size={18} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TurmasArquivadas;
