import React from "react";
import { graduarAluno } from "../../services/alunoService";

const ALUNO_ID = "af7ac881-8cd7-4259-aee7-25a1961c5ce4";

const Home = () => {
  async function teste() {
    try {
      const response = await graduarAluno(
        ALUNO_ID,
        "AZUL",
        2
      );

      console.log("✅ Aluno graduado com sucesso:");
      console.log(response);

    } catch (error) {
      console.error(
        "❌ Erro ao graduar aluno:",
        error?.response?.data || error
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "50px",
      }}
    >
      <button onClick={teste}>
        Testar Graduação
      </button>
    </div>
  );
};

export default Home;