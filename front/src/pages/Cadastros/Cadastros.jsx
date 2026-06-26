import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { criarAlunoExistente } from "../../services/alunoService";
import { criarProfessor } from "../../services/professorService";
import "./Cadastros.css";

const FAIXAS = [
  "Branca", "Cinza", "Amarela", "Laranja",
  "Verde", "Azul", "Roxa", "Marrom", "Preta",
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
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
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
        u.nome?.toLowerCase().includes(valor.toLowerCase())
      );
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
  }

  function handleModoToggle(novoModo) {
    setModo(novoModo);
    setMessage("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!usuarioSelecionado) {
      setMessage("Selecione um usuário antes de cadastrar.");
      setMessageType("error");
      return;
    }

    setSalvando(true);

    try {
      if (!isAdmin || modo === "aluno") {
        await criarAlunoExistente(
          usuarioSelecionado.id,
          faixa,
          parseInt(grau) || 0,
          parseInt(frequencia) || 0,
          dataNascimento
        );
      } else {
        await criarProfessor(
          usuarioSelecionado.id,
          faixa,
          parseInt(grau) || 0
        );
      }

      const msgSucesso =
        !isAdmin || modo === "aluno"
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

  const titulo = isAdmin ? "Cadastrar Perfil" : "Cadastrar Aluno";

  const isAlunoMode = !isAdmin || modo === "aluno";

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
          {/* Nome com autocomplete */}
          <div className="form__group form__group--full" ref={dropdownRef}>
            <label htmlFor="nome">Nome</label>
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
              <option value="">Selecione...</option>
              {FAIXAS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Grau */}
          <div className="form__group">
            <label htmlFor="grau">
              {isAlunoMode ? "Grau Atual" : "Grau"}
            </label>
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
              disabled={!usuarioSelecionado || salvando}
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>
          </div>

          {message && (
            <p className={`message ${messageType}`}>{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Cadastros;
