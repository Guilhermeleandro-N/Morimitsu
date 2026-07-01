import React, {
  useContext,
  useState
} from "react";

import { AuthContext } from "../../context/AuthContext";

import {
  buscarProfessorEUsuario
} from "../../services/professorService";

function Home() {

  const { user } =
    useContext(AuthContext);

  const [dados, setDados] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [erro, setErro] =
    useState("");

  async function testarFuncao() {

    try {

      setLoading(true);
      setErro("");

      console.log(
        "Usuário logado:",
        user
      );

      const response =
        await buscarProfessorEUsuario(
          user.userId
        );

      console.log(response);

      setDados(response);

    } catch (error) {

      console.error(error);

      setErro(
        error.response?.data?.message ||
        "Erro ao buscar dados."
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
        margin: "0 auto"
      }}
    >

      <h1>
        Teste - buscarProfessorEUsuario
      </h1>

      <p>
        Usuário logado:
      </p>

      <pre>
        {JSON.stringify(user, null, 2)}
      </pre>

      <button
        onClick={testarFuncao}
        disabled={loading}
        style={{
          padding: "10px 20px",
          cursor: "pointer"
        }}
      >
        {loading
          ? "Buscando..."
          : "Buscar Professor"}
      </button>

      {erro && (
        <p
          style={{
            color: "red",
            marginTop: "20px"
          }}
        >
          {erro}
        </p>
      )}

      {dados && (

        <div
          style={{
            marginTop: "30px"
          }}
        >

          <h2>
            Dados retornados
          </h2>

          <pre
            style={{
              background: "#f4f4f4",
              padding: "15px",
              borderRadius: "8px",
              overflowX: "auto"
            }}
          >
            {JSON.stringify(
              dados,
              null,
              2
            )}
          </pre>

        </div>

      )}

    </div>

  );

}

export default Home;