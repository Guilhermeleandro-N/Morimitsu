import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { criarUser } from "../../services/userService";
import { criarAlunoExistente } from "../../services/alunoService";
import { criarProfessor } from "../../services/professorService";
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
  const [dataNascimento, setDataNascimento] = useState("");
  const [frequencia, setFrequencia] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [salvando, setSalvando] = useState(false);

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
      const response = await api.get("user");
      const body = response.data;
      // API retorna { data: [...], meta: { total, page, ... } }
      const lista = body?.data ?? body?.users ?? body;
      const array = Array.isArray(lista) ? lista : [];
      setUsuarios(array);
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
      console.log("Busca — valor:", valor, "usuarios.length:", usuarios.length, "filtrados:", filtrados.length);
      setSugestoes(filtrados.slice(0, 8));
      setDropdownAberto(filtrados.length > 0);
    }, 300);
  }

  function selecionarUsuario(usr) {
    setUsuarioSelecionado(usr);
    setBusca(usr.nome);
    setDropdownAberto(false);
    setSugestoes([]);
    setMessage("");
  }

  function limparFormulario() {
    setBusca("");
    setUsuarioSelecionado(null);
    setFaixa("");
    setGrau("");
    setDataNascimento("");
    setFrequencia("");
    setMessage("");
    setNovoUsuario(false);
    setNovoNome("");
    setNovoEmail("");
    setNovoTelefone("");
    setNovoSenha("");
  }

  function handleModoToggle(novoModo) {
    setModo(novoModo);
    setMessage("");
    setNovoUsuario(false);
    setUsuarioSelecionado(null);
    setBusca("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    let usuarioId;

    if (novoUsuario) {
      // Valida campos do novo usuário
      if (!novoNome.trim() || !novoEmail.trim() || !novoSenha.trim()) {
        setMessage("Preencha nome, e-mail e senha do novo usuário.");
        setMessageType("error");
        return;
      }

      setSalvando(true);

      try {
        const userResponse = await criarUser(
          novoNome.trim(),
          novoEmail.trim(),
          novoSenha,
          novoTelefone.trim(),
        );

        if (!userResponse || !userResponse.id) {
          const msg =
            userResponse?.message ||
            "Erro ao criar usuário. Verifique os dados.";
          setMessage(msg);
          setMessageType("error");
          setSalvando(false);
          return;
        }

        usuarioId = userResponse.id;
      } catch (error) {
        setMessage("Erro ao criar usuário. Tente novamente.");
        setMessageType("error");
        setSalvando(false);
        return;
      }
    } else {
      if (!usuarioSelecionado) {
        setMessage('Selecione um usuário ou ative "Novo usuário".');
        setMessageType("error");
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
        await criarProfessor(usuarioId, faixa, parseInt(grau) || 0);
      }

      const msgSucesso = isAlunoMode
        ? "Aluno cadastrado com sucesso!"
        : "Professor cadastrado com sucesso!";

      limparFormulario();
      setMessage(msgSucesso);
      setMessageType("success");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Erro ao cadastrar. Verifique os dados.";
      setMessage(msg);
      setMessageType("error");
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
          {novoUsuario ? (
            <>
              {/* Campos do novo usuário */}
              <div className="form__group form__group--full">
                <div className="form__label-row">
                  <label htmlFor="novoNome">Nome completo</label>
                  <button
                    type="button"
                    className="btn-novo-usuario"
                    onClick={() => {
                      setNovoUsuario(false);
                      setNovoNome("");
                      setNovoEmail("");
                      setNovoTelefone("");
                      setNovoSenha("");
                    }}
                  >
                    ← Buscar usuário existente
                  </button>
                </div>
                <input
                  type="text"
                  id="novoNome"
                  placeholder="Nome completo"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  required
                />
              </div>

              <div className="form__group">
                <label htmlFor="novoEmail">E-mail</label>
                <input
                  type="email"
                  id="novoEmail"
                  placeholder="email@exemplo.com"
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form__group">
                <label htmlFor="novoTelefone">Telefone</label>
                <input
                  type="tel"
                  id="novoTelefone"
                  placeholder="(85) 99999-9999"
                  value={novoTelefone}
                  onChange={(e) => setNovoTelefone(e.target.value)}
                />
              </div>

              <div className="form__group form__group--full">
                <label htmlFor="novoSenha">Senha</label>
                <input
                  type="password"
                  id="novoSenha"
                  placeholder="Mín. 8 caracteres"
                  value={novoSenha}
                  onChange={(e) => setNovoSenha(e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              {/* Nome com autocomplete */}
              <div className="form__group form__group--full" ref={dropdownRef}>
                <div className="form__label-row">
                  <label htmlFor="nome">Nome</label>
                  <button
                    type="button"
                    className="btn-novo-usuario"
                    onClick={() => {
                      setNovoUsuario(true);
                      setUsuarioSelecionado(null);
                      setBusca("");
                      setSugestoes([]);
                      setDropdownAberto(false);
                    }}
                  >
                    + Novo usuário
                  </button>
                </div>
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
              </div>

              {/* Email */}
              <div className="form__group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  value={usuarioSelecionado?.email || ""}
                  disabled
                  placeholder="—"
                />
              </div>

              {/* Telefone */}
              <div className="form__group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  value={usuarioSelecionado?.telefone || ""}
                  disabled
                  placeholder="—"
                />
              </div>
            </>
          )}

          {/* Faixa */}
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
                <option key={f.nome} value={f.nome}>
                  {f.nome}
                </option>
              ))}
            </select>
            {faixa && (
              <span
                className="faixa-cor"
                style={{
                  backgroundColor: FAIXAS.find((f) => f.nome === faixa)?.cor,
                }}
              />
            )}
          </div>

          {/* Grau */}
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

          {/* Campos extras só para Aluno */}
          {isAlunoMode && (
            <>
              <div className="form__group">
                <label htmlFor="dataNascimento">Data de Nascimento</label>
                <input
                  type="date"
                  id="dataNascimento"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  required
                />
              </div>

              <div className="form__group">
                <label htmlFor="frequencia">Frequência Atual</label>
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
            </>
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

          {message && <p className={`message ${messageType}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default Cadastros;
