import React, { useEffect, useState } from "react";
import { listarAlunosCompleto } from "../../services/alunoService";
import { atualizarStatusUsuario } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash, FaArchive } from "react-icons/fa";

import "./ListarAlunos.css";

const ListarAluno = () => {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  function abrirPerfil(userId) {
    navigate("/perfilAluno", { state: { id: userId } });
  }

  async function handleArquivar(aluno) {
    const novoStatus = aluno.usuario?.status === "ENABLED" ? "DISABLED" : "ENABLED";
    try {
      await atualizarStatusUsuario(aluno.usuarioId, novoStatus);
      setAlunos((prev) =>
        prev.map((a) =>
          a.id === aluno.id ? { ...a, usuario: { ...a.usuario, status: novoStatus } } : a
        )
      );
    } catch (error) {
      console.error("Erro ao arquivar:", error);
    }
  }

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const response = await listarAlunosCompleto();
        setAlunos(response);
      } catch (error) {
        console.log("Erro ao carregar alunos:", error);
      }
    }
    carregarAlunos();
  }, []);

  const alunosFiltrados = filtroStatus === "TODOS"
    ? alunos.filter((a) => a.usuario)
    : alunos.filter((a) => a.usuario && a.usuario.status === filtroStatus);

  function getFaixaClass(faixa) {
    switch (faixa?.toLowerCase()) {
      case "branca": return "faixa branca";
      case "amarela": return "faixa amarela";
      case "laranja": return "faixa laranja";
      case "verde": return "faixa verde";
      case "azul": return "faixa azul";
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
                        aluno.usuario?.status === "ENABLED" ? "status ativo" : "status inativo"
                      }
                    >
                      {aluno.usuario?.status === "ENABLED" ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => handleArquivar(aluno)}>
                      <FaArchive />
                    </button>
                  </td>
                  <td>
                    <button className="icon-btn delete">
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
    </div>
  );
};

export default ListarAluno;
