import React from 'react';
import "./PerfilAluno.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  BuscarAlunoCompletoPorUserId,
  graduarAluno
} from '../../services/alunoService';
import RoleGuard from '../../routes/RoleGuard';
import GraduarAlunoModal from "../../components/GraduarAluno/GraduarAlunoModal.jsx";

const PerfilAluno = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.id;

  const [alunoData, setAlunoData] = useState(null);
  const [primeiraLetra, setPrimeiraLetra] = useState("");
  const [modalGraduacaoOpen, setModalGraduacaoOpen] = useState(false);

  function formatarDataBR(data) {
    if (!data) return "--";

    const iso = data.toString();
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`;
    }

    return data;
  }

  async function buscarAluno() {
    if (!userId) return;

    try {
      const response = await BuscarAlunoCompletoPorUserId(userId);

      setAlunoData(response);
      setPrimeiraLetra(response?.nome?.charAt(0) ?? "");

      console.log(response);

    } catch (error) {
      console.error(error);
    }
  }

  async function handleGraduarAluno(dados) {
    try {

      await graduarAluno(
        alunoData.id,
        dados.faixa,
        dados.grau_faixa
      );

      await buscarAluno();

      

      setModalGraduacaoOpen(false);

    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
        "Erro ao graduar aluno."
      );
    }
  }

  useEffect(() => {
    buscarAluno();
  }, [userId]);

  const dadosAluno = alunoData || {};
  const faixa = dadosAluno.faixa ?? "";
  const grau = dadosAluno.grau_faixa ?? "";
  const presencas = dadosAluno.frequencia_atual ?? 0;

  const historico =
    dadosAluno.historico_frequencias ?? [];

  return (
    <div className='main'>
      <div className="container">

        <header className="page-header">

          <div className="header-info">
            <h1>Perfil do Aluno</h1>
            <p>Visualize os dados presentes no perfil</p>
          </div>

          <RoleGuard allowedRoutes={["admin", "professor"]}>
            <button
              className="btn-edit"
              onClick={() =>
                navigate("/editarAluno", {
                  state: alunoData
                })
              }
            >
              Editar Aluno
            </button>
          </RoleGuard>

        </header>

        <main className="profile-grid">

          <aside className="sidebar-card">

            <h2 className="card-title">
              Dados Pessoais
            </h2>

            <div className="avatar-container">
              <div className="avatar-placeholder">
                {primeiraLetra}
              </div>
            </div>

            <h3 className="student-name">
              {dadosAluno.nome || "Aluno"}
            </h3>

            <span
              className={`status-badge ${String(
                dadosAluno.status || ""
              ).toLowerCase()}`}
            >
              {dadosAluno.status || "--"}
            </span>

            <div className="personal-details">
              <p>
                <strong>E-mail:</strong>{" "}
                {dadosAluno.email || "--"}
              </p>

              <p>
                <strong>Telefone:</strong>{" "}
                {dadosAluno.telefone || "--"}
              </p>

              <p>
                <strong>Nascimento:</strong>{" "}
                {formatarDataBR(
                  dadosAluno.data_nascimento
                )}
              </p>

              <p>
                <strong>Faixa:</strong>{" "}
                {faixa || "--"}
              </p>

              <p>
                <strong>Grau:</strong>{" "}
                {grau ?? "--"}
              </p>
            </div>

            <RoleGuard allowedRoutes={["admin", "professor"]}>
              <button
                className="btn-graduate"
                onClick={() =>
                  setModalGraduacaoOpen(true)
                }
              >
                Graduar Aluno
              </button>
            </RoleGuard>

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
                  <th>Frequência</th>
                  <th>Turma</th>
                </tr>
              </thead>

              <tbody>

                {historico.length > 0 ? (
                  historico.map((item, index) => (
                    <tr key={index}>

                      <td data-label="Data">
                        {formatarDataBR(item.data)}
                      </td>

                      <td data-label="Frequência">
                        <div className="presence-status">

                          <span>
                            {item.status_presenca}
                          </span>

                          <button
                            className={`presence-button ${
                              item.status_presenca === "PRESENTE"
                                ? "present"
                                : "absent"
                            }`}
                          ></button>

                        </div>
                      </td>

                      <td data-label="Turma">
                        {item.turma_nome}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                        padding: "20px"
                      }}
                    >
                      Nenhum histórico encontrado.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </section>

        </main>

      </div>

      {modalGraduacaoOpen && (
        <GraduarAlunoModal
          onClose={() =>
            setModalGraduacaoOpen(false)
          }
          onSave={handleGraduarAluno}
        />
      )}

    </div>
  );
};

export default PerfilAluno;