import { useState, useEffect } from "react";
import { listarAlunosCompleto } from "../../services/alunoService";
function Home() {
  const [alunos, setAlunos] = useState([]);
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    listarAlunosCompleto().then((data) => setAlunos(data));
  }, []);

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Pesquisar aluno..."
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      <ul>
        {alunosFiltrados.map((aluno) => (
          <li key={aluno.id}>{aluno.nome}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;