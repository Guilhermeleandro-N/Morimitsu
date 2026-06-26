import React, { useState } from "react";
import { listarFrequenciasAluno } from "../../services/frequenciaService";

function Home() {
  const [alunoId, setAlunoId] = useState("");
  const [frequencias, setFrequencias] = useState([]);
  const [loading, setLoading] = useState(false);

  async function buscarFrequencias() {
    if (!alunoId.trim()) {
      alert("Informe o ID do aluno.");
      return;
    }

    try {
      setLoading(true);

      const response = await listarFrequenciasAluno(alunoId);

      setFrequencias(response);

      console.log(response);
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar frequências.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Teste - Listar Frequências do Aluno</h2>

      <input
        type="text"
        placeholder="ID do aluno"
        value={alunoId}
        onChange={(e) => setAlunoId(e.target.value)}
        style={{
          width: "600px",
          padding: "10px",
          marginRight: "10px"
        }}
      />

      <button onClick={buscarFrequencias}>
        Buscar Frequências
      </button>

      {loading && <p>Carregando...</p>}

      {!loading && frequencias.length > 0 && (
        <table
          border="1"
          cellPadding="8"
          style={{
            marginTop: "20px",
            borderCollapse: "collapse",
            width: "100%"
          }}
        >
          <thead>
            <tr>
              <th>Data</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Status</th>
              <th>Professor</th>
              <th>Turma</th>
            </tr>
          </thead>

          <tbody>
            {frequencias.map((freq) => (
              <tr key={freq.id}>
                <td>
                  {new Date(freq.data).toLocaleDateString()}
                </td>

                <td>
                  {new Date(freq.horario_inicio).toLocaleTimeString()}
                </td>

                <td>
                  {new Date(freq.horario_fim).toLocaleTimeString()}
                </td>

                <td>{freq.status_presenca}</td>

                <td>{freq.professor_id}</td>

                <td>{freq.turma_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && frequencias.length === 0 && (
        <p style={{ marginTop: "20px" }}>
          Nenhuma frequência encontrada.
        </p>
      )}
    </div>
  );
}

export default Home;