import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarUser } from "../../services/userService";
import addUserIcon from "../../assets/addUser.png";
import "./CadastrarUsuario.css";

function CadastrarUsuario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    data_nascimento: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showToast, setShowToast] = useState(false);

  function showMessage(msg, type) {
    setMessage(msg);
    setMessageType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setShowToast(false);

    try {
      const response = await criarUser(
        form.nome,
        form.email,
        form.senha,
        form.telefone
      );

      if (response && response.id) {
        showMessage("✔ Usuário cadastrado com sucesso!", "success");
        setForm({
          nome: "",
          email: "",
          telefone: "",
          senha: "",
          data_nascimento: "",
        });
        setTimeout(() => navigate("/login"), 2500);
      } else {
        showMessage("✖ Erro ao cadastrar usuário. Tente novamente.", "error");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "✖ Erro ao conectar com o servidor.";
      showMessage(msg, "error");
    }
  }

  return (
    <div className="register">
      <div className="register__container">
        <div className="register__header">
          <div className="register__icons">
            <img src={addUserIcon} alt="Cadastrar" />
          </div>
          <div>
            <h2 className="register__title">Cadastrar Usuário</h2>
            <p className="register__subtitle">
              Crie sua conta para acessar o sistema
            </p>
          </div>
        </div>

        <form className="register__form" onSubmit={handleSubmit}>
          <div className="form__group form__group--full">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Nome completo"
              value={form.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form__group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email@exemplo.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form__group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              placeholder="(85) 99999-9999"
              value={form.telefone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form__group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Mín. 8 caracteres, 1 maiúsculo, 1 número, 1 especial"
              value={form.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form__group">
            <label htmlFor="data_nascimento">Data de Nascimento</label>
            <input
              type="date"
              id="data_nascimento"
              name="data_nascimento"
              value={form.data_nascimento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form__actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/login")}
            >
              Voltar ao Login
            </button>
            <button type="submit" className="btn-primary">
              Cadastrar
            </button>
          </div>

          {showToast && (
            <div className={`toast ${messageType}`}>
              <span className="toast-icon">
                {messageType === "success" ? "✔" : "✖"}
              </span>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CadastrarUsuario;
