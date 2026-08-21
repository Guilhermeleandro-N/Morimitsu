import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { criarUser } from "../../services/userService";
import { criarAlunoExistente, BuscaAlunoPorUserId } from "../../services/alunoService";
import { criarProfessor } from "../../services/professorService";
import { listarPerfisDoUsuario, listarUsuarios } from "../../services/authorizationService";
import { useToast } from "../../context/ToastContext";
import "./Cadastros.css";

const FAIXAS = [
  { nome: "Branca", cor: "#f5f5f5" },
  { nome: "Cinza", cor: "#9e9e9e" },
  { nome: "Amarela", cor: "#fdd835" },
  { nome: "Laranja", cor: "#ff9800" },
  { nome: "Verde", cor: "#4caf50" },
  { nome: "Azul", cor: "#2196f3" },
  { nome: "Roxa", cor: "#9c27b0" },
  { nome: "Marrom", cor: "#795548" },
  { nome: "Preta", cor: "#212121" },
];

function Cadastros() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.roles?.includes("admin");

  const [modo, setModo] = useState("aluno");
  const [busca, setBusca] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  const [faixa, setFaixa] = useState("");
  const [grau, setGrau] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  const [salvando, setSalvando] = useState(false);
  const { addToast } = useToast();

  // Modo "Novo usuário"
  const [novoUsuario, setNovoUsuario] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoTelefone, setNovoTelefone] = useState("");
  const [novoSenha, setNovoSenha] = useState("");

  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function carregarUsuarios() {
    try {
      const lista = await listarUsuarios();
      const array = Array.isArray(lista) ? lista : [];

      // Filtra administradores — admin não pode ser cadastrado como aluno/professor
      const naoAdmins = [];
      for (const user of array) {
        try {
          const perfis = await listarPerfisDoUsuario(user.id);
          const isAdmin = perfis.some((p) => p.nome?.toLowerCase() === "admin");
          if (!isAdmin) naoAdmins.push(user);
        } catch {
          naoAdmins.push(user);
        }
      }

      setUsuarios(naoAdmins);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setUsuarios([]);
    }
  }

  function handleBuscaChange(e) {
    const valor = e.target.value;
    setBusca(valor);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (valor.trim().length < 2) {
      setSugestoes([]);
      setDropdownAberto(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const filtrados = usuarios.filter((u) =>
        u.nome?.toLowerCase().includes(valor.toLowerCase()),
      );
      console.log(
        "Busca — valor:",
        valor,
        "usuarios.length:",
        usuarios.length,
        "filtrados:",
        filtrados.length,
      );
      setSugestoes(filtrados.slice(0, 8));
      setDropdownAberto(filtrados.length > 0);
    }, 300);
  }

  async function selecionarUsuario(usr) {
    setUsuarioSelecionado(usr);
    setBusca(usr.nome);
    setDropdownAberto(false);
    setSugestoes([]);
    try {
      const aluno = await BuscaAlunoPorUserId(usr.id);
      if (aluno?.id) {
        setFaixa((aluno.faixa || "").toUpperCase());
        setGrau(aluno.grau_faixa ?? "");
        setFrequencia(aluno.frequencia_atual ?? "");
      } else {
        setFaixa("");
        setGrau("");
        setFrequencia("");
      }
    } catch {
      setFaixa("");
      setGrau("");
      setFrequencia("");
    }
  }

  function limparFormulario() {
    setBusca("");
    setUsuarioSelecionado(null);
    setFaixa("");
    setGrau("");
    setFrequencia("");
    setNovoUsuario(false);
    setNovoNome("");
    setNovoEmail("");
    setNovoTelefone("");
    setNovoSenha("");
  }

  function handleModoToggle(novoModo) {
    setModo(novoModo);
    setNovoUsuario(false);
    setUsuarioSelecionado(null);
    setBusca("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let usuarioId;

    if (novoUsuario) {
      // Valida campos do novo usuário
      if (!novoNome.trim() || !novoEmail.trim() || !novoSenha.trim()) {
        addToast("Preencha nome, e-mail e senha do novo usuário.", "error");
        return;
      }

      setSalvando(true);

      try {
        const userResponse = await criarUser(
          novoNome.trim(),
          novoEmail.trim(),
          novoSenha,
          novoTelefone.trim(),
          dataNascimento,
        );

        if (!userResponse || !userResponse.id) {
          const msg =
            userResponse?.message ||
            "Erro ao criar usuário. Verifique os dados.";
          addToast(msg, "error");
          setSalvando(false);
          return;
        }

        usuarioId = userResponse.id;
      } catch {
        addToast("Erro ao criar usuário. Tente novamente.", "error");
        setSalvando(false);
        return;
      }
    } else {
      if (!usuarioSelecionado) {
        addToast('Selecione um usuário ou ative "Novo usuário".', "error");
        return;
      }
      usuarioId = usuarioSelecionado.id;
      setSalvando(true);
    }

    try {
      const isAlunoMode = !isAdmin || modo === "aluno";

      if (isAlunoMode) {
        await criarAlunoExistente(
          usuarioId,
          faixa,
          parseInt(grau) || 0,
          parseInt(frequencia) || 0,
          dataNascimento,
        );
      } else {
        await criarProfessor(
          usuarioId,
          faixa,
          parseInt(grau) || 0,
          parseInt(frequencia) || 0,
          dataNascimento,
        );
      }

      const msgSucesso = isAlunoMode
        ? "Aluno cadastrado com sucesso!"
        : "Professor cadastrado com sucesso!";

      limparFormulario();
      addToast(msgSucesso, "success");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Erro ao cadastrar. Verifique os dados.";
      addToast(msg, "error");
    } finally {
      setSalvando(false);
    }
  }

  const titulo = "Cadastrar Perfil";

  const isAlunoMode = !isAdmin || modo === "aluno";
  const podeSalvar = novoUsuario
    ? novoNome.trim() && novoEmail.trim() && novoSenha.trim()
    : !!usuarioSelecionado;

  return (
    <div className="register">
      <div className="register__container">
        <div className="register__header">
          <div className="register__header-left">
            <div>
              <h2 className="register__title">{titulo}</h2>
            </div>
          </div>

          {isAdmin && (
            <div className="toggle-container">
              <button
                type="button"
                className={`toggle-btn ${modo === "aluno" ? "active" : ""}`}
                onClick={() => handleModoToggle("aluno")}
              >
                Aluno
              </button>
              <button
                type="button"
                className={`toggle-btn ${modo === "professor" ? "active" : ""}`}
                onClick={() => handleModoToggle("professor")}
              >
                Professor
              </button>
            </div>
          )}
        </div>

        <form className="register__form" onSubmit={handleSubmit}>
          {/* Nome */}
          <div className="form__group form__group--full" ref={dropdownRef}>
            <div className="form__label-row">
              <label htmlFor={novoUsuario ? "novoNome" : "nome"}>
                {novoUsuario ? "Nome completo" : "Nome"}
              </label>
              <button
                type="button"
                className="btn-novo-usuario"
                onClick={() => {
                  if (novoUsuario) {
                    setNovoUsuario(false);
                    setNovoNome("");
                    setNovoEmail("");
                    setNovoTelefone("");
                    setNovoSenha("");
                  } else {
                    setNovoUsuario(true);
                    setUsuarioSelecionado(null);
                    setBusca("");
                    setSugestoes([]);
                    setDropdownAberto(false);
                  }
                }}
              >
                {novoUsuario ? "← Buscar usuário existente" : "+ Novo usuário"}
              </button>
            </div>
            {novoUsuario ? (
              <input
                type="text"
                id="novoNome"
                placeholder="Nome completo"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                required
              />
            ) : (
              <div className="busca-wrapper">
                <input
                  type="text"
                  id="nome"
                  placeholder="Digite o nome do usuário..."
                  value={busca}
                  onChange={handleBuscaChange}
                  onFocus={() => {
                    if (sugestoes.length > 0) setDropdownAberto(true);
                  }}
                  autoComplete="off"
                  required
                />
                {dropdownAberto && sugestoes.length > 0 && (
                  <div className="busca-dropdown">
                    {sugestoes.map((usr) => (
                      <div
                        key={usr.id}
                        className="busca-item"
                        onClick={() => selecionarUsuario(usr)}
                      >
                        <div className="busca-nome">{usr.nome}</div>
                        <div className="busca-email">{usr.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* E-mail */}
          <div className="form__group form__group--full">
            <label htmlFor={novoUsuario ? "novoEmail" : "email"}>E-mail</label>
            {novoUsuario ? (
              <input
                type="email"
                id="novoEmail"
                placeholder="email@morimitsu.com"
                value={novoEmail}
                onChange={(e) => setNovoEmail(e.target.value)}
                required
              />
            ) : (
              <input
                type="email"
                id="email"
                value={usuarioSelecionado?.email || ""}
                disabled
                placeholder="—"
              />
            )}
          </div>

          {/* Senha | Faixa Atual */}
          {novoUsuario && (
            <div className="form__group">
              <label htmlFor="novoSenha">Senha</label>
              <input
                type="password"
                id="novoSenha"
                placeholder="Mín. 8 caracteres, 1 maiúsculo, 1 número e 1 especial"
                value={novoSenha}
                onChange={(e) => setNovoSenha(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form__group">
            <label htmlFor="faixa">
              {isAlunoMode ? "Faixa Atual" : "Faixa"}
            </label>
            <select
              id="faixa"
              value={faixa}
              onChange={(e) => setFaixa(e.target.value)}
              required
            >
              <option value="">Selecione</option>
              {FAIXAS.map((f) => (
                <option key={f.nome} value={f.nome.toUpperCase()}>
                  {f.nome}
                </option>
              ))}
            </select>
            {faixa && (
              <span
                className="faixa-cor"
                style={{
                  backgroundColor: FAIXAS.find(
                    (f) => f.nome.toUpperCase() === faixa
                  )?.cor,
                }}
              />
            )}
          </div>

          {/* Grau Atual | Telefone */}
          <div className="form__group">
            <label htmlFor="grau">{isAlunoMode ? "Grau Atual" : "Grau"}</label>
            <input
              type="number"
              id="grau"
              min="0"
              max="4"
              placeholder="0"
              value={grau}
              onChange={(e) => setGrau(e.target.value)}
              required
            />
          </div>

          <div className="form__group">
            <label htmlFor={novoUsuario ? "novoTelefone" : "telefone"}>
              Telefone
            </label>
            {novoUsuario ? (
              <input
                type="tel"
                id="novoTelefone"
                placeholder="(85) 99999-9999"
                value={novoTelefone}
                onChange={(e) => setNovoTelefone(e.target.value)}
              />
            ) : (
              <input
                type="tel"
                id="telefone"
                value={usuarioSelecionado?.telefone || ""}
                disabled
                placeholder="—"
              />
            )}
          </div>

          {/* Frequência | Data de Nascimento */}
          <div className="form__group">
            <label htmlFor="frequencia">
              {isAlunoMode ? "Frequência Atual" : "Frequência"}
            </label>
            <input
              type="number"
              id="frequencia"
              min="0"
              placeholder="0"
              value={frequencia}
              onChange={(e) => setFrequencia(e.target.value)}
              required
            />
          </div>

          {novoUsuario && (
            <div className="form__group">
              <label htmlFor="dataNascimento">Data de Nascimento</label>
              <input
                type="date"
                id="dataNascimento"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
            </div>
          )}

          {/* Botões */}
          <div className="form__actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={limparFormulario}
            >
              Limpar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!podeSalvar || salvando}
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Cadastros;
