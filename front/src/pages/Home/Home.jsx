import React, { useState } from "react";

import { editarFrequencia } from "../../services/frequenciaService";

function Home() {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState(null);

  async function testarEdicao() {
    try {
      setLoading(true);
      setErro("");

      const response = await editarFrequencia(
        "be5cc94b-2775-4056-9b6a-80540a571b0f",
        {
          status_presenca: "AUSENTE",
        }
      );

      console.log(response);
      setResultado(response);

    } catch (error) {
      console.error(error);

      setErro(
        error.response?.data?.message ||
        "Erro ao editar frequência."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>Teste - Editar Frequência</h1>

      <p>
        Frequência que será editada:
      </p>

      <pre
        style={{
          background: "#f4f4f4",
          padding: "15px",
          borderRadius: "8px",
          overflowX: "auto",
        }}
      >
{JSON.stringify(
{
  id: "be5cc94b-2775-4056-9b6a-80540a571b0f",
  aluno_id: "ac8717df-3e4f-4e82-9802-3bbde30eb59b",
  professor_id: "6199ce05-34db-44d2-b1a2-1c2215d6574d",
  turma_id: "7a00c359-dad7-4a8e-8bbf-2da7da6a84ff",
  data: "2026-07-27T12:53:46.013Z",
  horario_inicio: "2026-07-27T10:53:46.013Z",
  horario_fim: "2026-07-27T12:53:46.013Z",
  status_presenca: "PRESENTE",
},
null,
2
)}
      </pre>

      <button
        onClick={testarEdicao}
        disabled={loading}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        {loading
          ? "Editando..."
          : "Alterar para AUSENTE"}
      </button>

      {erro && (
        <p
          style={{
            color: "red",
            marginTop: "20px",
          }}
        >
          {erro}
        </p>
      )}

      {resultado && (
        <div
          style={{
            marginTop: "30px",
          }}
        >
          <h2>Resposta da API</h2>

          <pre
            style={{
              background: "#f4f4f4",
              padding: "15px",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(resultado, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Home;