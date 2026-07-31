import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { atualizarProfessor } from "../../services/professorService";
import { atualizarStatusUsuario } from "../../services/userService";
import api from "../../api/axios";
import addUser from "../../assets/addUser.png";
import "./EditarProfessor.css";

const EditarProfessor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const professorData = location.state;

  if (!professorData) {
    return <h2>Professor não encontrado</h2>;
  }

  const [form, setForm] = useState({
    nome: professorData.nome || "",
    email: professorData.email || "",
    telefone: professorData.telefone || "",
    faixa: professorData.faixa || "",
    grau: professorData.grau ?? 0,
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Atualiza dados do usuário (nome, email, telefone)
      await api.patch(`user/${professorData.usuarioId}`, {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
      });

      // Atualiza dados do professor (faixa, grau)
      await atualizarProfessor(professorData.id, {
        faixa: form.faixa,
        grau: parseInt(form.grau),
      });

      setMessage("Professor atualizado com sucesso");
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao atualizar professor.");
    }
  }

  return (
    <div className="register">
      <div className="register__container">
        <div className="register__header">
          <div className="register__icons">
            <img src={addUser} alt="" />
          </div>
          <div className="register__header-text">
            <h2 className="register__title">Editar Professor</h2>
            <p className="register__subtitle">Edite os dados do professor</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="register__form">
            <div className="form__group form__group--full">
              <label htmlFor="nome">Nome</label>
              <input type="text" id="nome" name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
            </div>

            <div className="form__group form__group--full">
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" name="email" placeholder="email@example.com" value={form.email} onChange={handleChange} />
            </div>

            <div className="form__group">
              <label htmlFor="telefone">Telefone</label>
              <input type="tel" id="telefone" name="telefone" placeholder="(XX) XXXXX-XXXX" value={form.telefone} onChange={handleChange} />
            </div>

            <div className="form__group">
              <label htmlFor="grau">Grau</label>
              <input type="number" id="grau" name="grau" placeholder="Grau" value={form.grau} onChange={handleChange} />
            </div>

            <div className="form__group form__group--full">
              <label htmlFor="faixa">Faixa</label>
              <select id="faixa" name="faixa" value={form.faixa} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="branca">Branca</option>
                <option value="cinza">Cinza</option>
                <option value="amarela">Amarela</option>
                <option value="laranja">Laranja</option>
                <option value="verde">Verde</option>
                <option value="azul">Azul</option>
                <option value="roxa">Roxa</option>
                <option value="marrom">Marrom</option>
                <option value="preta">Preta</option>
              </select>
            </div>

            <div className="form__actions">
              <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
                Descartar Alterações
              </button>
              <button type="submit" className="btn-primary">
                Salvar Alterações
              </button>
            </div>

            {message && <p className="message">{message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarProfessor;
