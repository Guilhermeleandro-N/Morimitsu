import React, { useState } from "react";
import { listarProfessoresDaTurma } from "../../services/turmaService";

function TesteListarProfessoresTurma() {

  const [turmaId, setTurmaId] =
    useState("");

  const [resultado, setResultado] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  async function buscarProfessores() {

    try {

      setLoading(true);

      const response =
        await listarProfessoresDaTurma(
          turmaId
        );

      console.log(
        "Professores da turma:",
        response
      );

      setResultado(response);

    } catch (error) {

      console.error(
        error.response?.data || error
      );

      setResultado(
        error.response?.data ||
        error.message
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "30px",
      }}
    >

      <h1>
        Teste - Professores da Turma
      </h1>

      <input
        type="text"
        placeholder="Digite o ID da turma"
        value={turmaId}
        onChange={(e) =>
          setTurmaId(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={
          buscarProfessores
        }
      >
        Buscar Professores
      </button>

      <hr />

      <h2>
        Resultado
      </h2>

      {loading ? (

        <p>
          Carregando...
        </p>

      ) : (

        <pre
          style={{
            background: "#f5f5f5",
            padding: "20px",
            borderRadius: "8px",
            overflowX: "auto",
            minHeight: "250px",
          }}
        >
          {JSON.stringify(
            resultado,
            null,
            2
          )}
        </pre>

      )}

    </div>

  );

}

export default TesteListarProfessoresTurma;