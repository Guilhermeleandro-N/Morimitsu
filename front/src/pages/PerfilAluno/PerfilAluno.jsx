import React from 'react';
import "./PerfilAluno.css"
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BuscarAlunoCompletoPorUserId } from '../../services/alunoService';
import RoleGuard from '../../routes/RoleGuard';
import GraduarAlunoModal from "../../components/GraduarAluno/GraduarAlunoModal.jsx";

const PerfilAluno = () => {

  const Navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.id;
  const [alunoData, setAlunoData] = useState(null)
  const [primeiraLetra, setPrimeiraLetra] = useState("")
  const [modalGraduacaoOpen, setModalGraduacaoOpen] = useState(false);

  function formatarDataBR(data) {
    if (!data) return "--"
    const iso = data.toString()
    const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (match) {
      return `${match[3]}/${match[2]}/${match[1]}`
    }
    return data
  }

  useEffect(() => {
    async function buscarAluno() {
      if (!userId) return;

      try {
        const response = await BuscarAlunoCompletoPorUserId(userId)
        setAlunoData(response)
        setPrimeiraLetra(response?.nome?.charAt(0) ?? "")
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }

    buscarAluno();
  }, [userId])

  const dadosAluno = alunoData || {}
  const faixa = dadosAluno.faixa ?? ""
  const grau = dadosAluno.grau_faixa ?? ""
  const presencas = dadosAluno.frequencia_atual ?? 0
  const historico = dadosAluno.historico || []

  return (
    <div className='main'>
      <div className="container">

        <header className="page-header">
          <div className="header-info">
            <h1>Perfil do Aluno</h1>
            <p>Visualize os dados presentes no perfil</p>
          </div>

          <RoleGuard allowedRoutes={["admin", "professor"]}>
            <button className="btn-edit" onClick={() => { Navigate("/editarAluno", { state: alunoData }) }} >Editar Aluno</button>
          </RoleGuard>
        </header>

        <main className="profile-grid">
          {/* Coluna da Esquerda: Dados Pessoais */}
          <aside className="sidebar-card">
            <h2 className="card-title">Dados Pessoais</h2>

            <div className="avatar-container">
              <div className="avatar-placeholder">
                {primeiraLetra}
              </div>
            </div>

            <h3 className="student-name">{dadosAluno.nome || "Aluno"}</h3>
            <span className={`status-badge ${String(dadosAluno.status || "").toLowerCase()}`}>
              {dadosAluno.status || "--"}
            </span>

            <div className="personal-details">
              <p><strong>E-mail:</strong> {dadosAluno.email || "--"}</p>
              <p><strong>Telefone:</strong> {dadosAluno.telefone || "--"}</p>
              <p><strong>Nascimento:</strong> {formatarDataBR(dadosAluno.data_nascimento)}</p>
              <p><strong>Faixa:</strong> {faixa || "--"}</p>
              <p><strong>Grau:</strong> {grau || "--"}</p>
            </div>
            <RoleGuard allowedRoutes={["admin", "professor"]} >
              <button
                className="btn-graduate"
                onClick={() => setModalGraduacaoOpen(true)}
              >
                Graduar Aluno
              </button>
            </RoleGuard>
          </aside>

          {/* Coluna da Direita: Indicadores e Tabela */}
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
                {historico.map((item, index) => (
                  <tr key={index}>
                    <td data-label="Data">{item.data}</td>

                    <td data-label="Frequência">
                      <div className="presence-status">
                        <span>{item.frequencia}</span>

                        <button
                          className={`presence-button ${item.frequencia === "Presente"
                            ? "present"
                            : "absent"
                            }`}
                        ></button>
                      </div>
                    </td>

                    <td data-label="Turma">{item.turma}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
      {modalGraduacaoOpen && (
        <GraduarAlunoModal
          onClose={() => setModalGraduacaoOpen(false)}
          onSave={(dados) => {
            console.log("Graduar aluno:", dados);
            setModalGraduacaoOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default PerfilAluno;