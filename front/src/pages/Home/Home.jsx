import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { buscarProfessorPorUsuarioId } from "../../services/professorService";

function Home() {

  const { user } = useContext(AuthContext);

  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(false);

  async function buscarProfessorLogado() {

    try {

      if (!user) {
        alert("Nenhum usuário logado.");
        return;
      }

      setLoading(true);

      console.log("Usuário logado:", user);
      console.log("User ID:", user.userId);

      const response =
        await buscarProfessorPorUsuarioId(
          user.userId
        );

      console.log(
        "Professor encontrado:",
        response
      );

      setProfessor(response);

    } catch (error) {

      console.error(
        "Erro:",
        error.response?.data || error
      );

      alert(
        "Erro ao buscar professor."
      );

    } finally {

      setLoading(false);

    }

  }

  return (
    <div style={{ padding: "30px" }}>

      <h1>
        Buscar Professor do Usuário Logado
      </h1>

      {user ? (
        <>
          <p>
            <strong>Nome:</strong> {user.nome}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>User ID:</strong> {user.userId}
          </p>

          <button
            onClick={buscarProfessorLogado}
            disabled={loading}
          >
            {loading
              ? "Buscando..."
              : "Buscar Professor"}
          </button>
        </>
      ) : (
        <p>Nenhum usuário logado.</p>
      )}

      {professor && (
        <div style={{ marginTop: "20px" }}>

          <h2>Professor Encontrado</h2>

          <p>
            <strong>ID do Professor:</strong>{" "}
            {professor.id}
          </p>

          <pre>
            {JSON.stringify(
              professor,
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