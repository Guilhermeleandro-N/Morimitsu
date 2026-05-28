import React from 'react';
import "./PerfilAluno.css"
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BuscarAlunoCompletoPorUserId } from '../../services/alunoService';

const PerfilAluno = () => {
  // Simulação de dados recebidos de uma API
  const Navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.id;
  const [alunoData, setAlunoData ]= useState("")
  const [primeiraLetra, setPrimeiraLetra] = useState("")
  useEffect(() => {
    async function buscarAluno() {
      try {
        const response = await BuscarAlunoCompletoPorUserId(userId)
        setAlunoData(response)
        setPrimeiraLetra(response.nome.charAt(0))
        console.log(alunoData);
      } catch (error) {
        console.log(error);
      }
  }
  buscarAluno();
  }, []
  )
  const studentData = {
    nome: "Carlos de Souza",
    status: "Ativo",
    email: "carlosou@gmail.com",
    telefone: "(88) 9 9999-9999",
    nascimento: "12/09/2001",
    indicadores: {
      presenca: 54,
      faixa: "Branca",
      graus: "II"
    },
    historico: [
      { data: "19/03/2026", frequencia: "Presente", turma: "Noite" },
      { data: "12/03/2026", frequencia: "Ausente", turma: "Noite" },
      { data: "05/03/2026", frequencia: "Presente", turma: "Tarde" },
      { data: "26/02/2026", frequencia: "Presente", turma: "Noite" },
      { data: "19/02/2026", frequencia: "Presente", turma: "Tarde" }
    ]
  };

  return (
    <div className='main'>
      <div className="container">

        <header className="page-header">
          <div className="header-info">
            <h1>Perfil do Aluno</h1>
            <p>Visualize os dados presentes no perfil</p>
          </div>
          <button className="btn-edit" onClick={() => { Navigate("/editarAluno") }} >Editar Aluno</button>
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

            <h3 className="student-name">{alunoData.nome}</h3>
            <span className={`status-badge ${studentData.status.toLowerCase()}`}>
              {alunoData.status}
            </span>

            <div className="personal-details">
              <p><strong>E-mail:</strong> {alunoData.email}</p>
              <p><strong>Telefone:</strong> {alunoData.telefone}</p>
              <p><strong>Nascimento:</strong> {alunoData.data_nascimento}</p>
              <p><strong>Faixa:</strong> {studentData.indicadores.faixa}</p>
              <p><strong>Grau:</strong> {studentData.indicadores.graus}</p>
            </div>
            <button className="btn-graduate">Graduar Aluno</button>
          </aside>

          {/* Coluna da Direita: Indicadores e Tabela */}
          <section className="content-card">
            <div className="history-header">
              <h3>Histórico Recente</h3>

              <div className="presence-total">
                <span>Presenças:</span>
                <strong>{studentData.indicadores.presenca}</strong>
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
                {studentData.historico.map((item, index) => (
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
    </div>
  );
};

export default PerfilAluno;