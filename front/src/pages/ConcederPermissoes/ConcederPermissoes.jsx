import { useEffect, useMemo, useState } from "react";

import "./ConcederPermissoes.css";

import { listarAlunosCompleto } from "../../services/alunoService";

function ConcederPermissoes() {

    const [usuarios, setUsuarios] = useState([]);

    const [busca, setBusca] = useState("");

    const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

    const [tipoUsuario, setTipoUsuario] = useState("PROFESSOR");

    const [permissoes, setPermissoes] = useState({

        turmas: true,
        frequencia: true,
        alunos: false,
        graduacao: true,
        financeiro: false,
        usuarios: true

    });

    useEffect(() => {

        async function carregarUsuarios() {

            try {

                const response = await listarAlunosCompleto();

                setUsuarios(response);

                if (response.length > 0) {
                    setUsuarioSelecionado(response[0]);
                }

            } catch (error) {

                console.log(error);

            }

        }

        carregarUsuarios();

    }, []);

    const permissoesSistema = [

        {
            id: "turmas",
            titulo: "Gerenciar Turmas",
            descricao: "Criar, editar e excluir turmas."
        },

        {
            id: "frequencia",
            titulo: "Registrar Frequência",
            descricao: "Realizar chamadas."
        },

        {
            id: "alunos",
            titulo: "Cadastrar Alunos",
            descricao: "Cadastrar novos alunos."
        },

        {
            id: "graduacao",
            titulo: "Gerenciar Graduação",
            descricao: "Alterar faixas e graus."
        },

        {
            id: "financeiro",
            titulo: "Financeiro",
            descricao: "Gerenciar pagamentos."
        },

        {
            id: "usuarios",
            titulo: "Conceder Permissões",
            descricao: "Alterar permissões de usuários."
        }

    ];

    const usuariosFiltrados = useMemo(() => {

        return usuarios.filter((aluno) =>
            aluno.usuario.nome
                .toLowerCase()
                .includes(busca.toLowerCase())
        );

    }, [usuarios, busca]);

    function alterarPermissao(nome) {

        setPermissoes((prev) => ({

            ...prev,

            [nome]: !prev[nome]

        }));

    }

    return (

        <div className="permissoes-container">

            <div className="page-header">

                <div>

                    <h1>Conceder Permissões</h1>

                    <p>
                        Conceder permissões aos usuários
                    </p>

                </div>

            </div>

            <div className="permissoes-content">

                <div className="usuarios-card">

                    <input
                        type="text"
                        placeholder="Pesquisar usuário..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="pesquisa-input"
                    />

                    <div className="usuarios-lista">

                        {usuariosFiltrados.map((aluno) => (

                            <div

                                key={aluno.id}

                                className={
                                    usuarioSelecionado?.id === aluno.id
                                        ? "usuario-item ativo"
                                        : "usuario-item"
                                }

                                onClick={() =>
                                    setUsuarioSelecionado(aluno)
                                }

                            >

                                {aluno.usuario.nome}

                            </div>

                        ))}

                    </div>

                </div>

                <div className="config-card">

                    {usuarioSelecionado && (

                        <>

                            <div className="config-topo">

                                <div>

                                    <h2>

                                        {usuarioSelecionado.usuario.nome}

                                    </h2>

                                    <p>

                                        Conceder permissões ao usuário selecionado

                                    </p>

                                </div>

                                <div className="tipo-container">

                                    <button

                                        className={
                                            tipoUsuario === "ALUNO"
                                                ? "tipo-btn ativo"
                                                : "tipo-btn"
                                        }

                                        onClick={() =>
                                            setTipoUsuario("ALUNO")
                                        }

                                    >

                                        Aluno

                                    </button>

                                    <button

                                        className={
                                            tipoUsuario === "PROFESSOR"
                                                ? "tipo-btn ativo"
                                                : "tipo-btn"
                                        }

                                        onClick={() =>
                                            setTipoUsuario("PROFESSOR")
                                        }

                                    >

                                        Professor

                                    </button>

                                </div>

                            </div>

                            <div className="permissoes-grid">

                                {permissoesSistema.map((perm) => (

                                    <div
                                        className="permissao-card"
                                        key={perm.id}
                                    >

                                        <div>

                                            <h4>{perm.titulo}</h4>

                                            <p>{perm.descricao}</p>

                                        </div>

                                        <label className="switch">

                                            <input
                                                type="checkbox"
                                                checked={permissoes[perm.id]}
                                                onChange={() =>
                                                    alterarPermissao(perm.id)
                                                }
                                            />

                                            <span className="slider"></span>

                                        </label>

                                    </div>

                                ))}

                            </div>

                            <div className="salvar-container">

                                <button className="btn-salvar">

                                    Salvar

                                </button>

                            </div>

                        </>

                    )}

                </div>

            </div>

        </div>

    );

}

export default ConcederPermissoes;