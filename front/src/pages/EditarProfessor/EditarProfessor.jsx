import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  atualizarProfessor,
  buscarProfessorEUsuario,
} from "../../services/professorService";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import addUser from "../../assets/addUser.png";
import "./EditarProfessor.css";

const EditarProfessor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const professorData = location.state;

  const [form, setForm] = useState({
    nome: professorData?.nome || "",
    email: professorData?.email || "",
    telefone: professorData?.telefone || "",
    data_nascimento: professorData?.data_nascimento
      ? String(professorData.data_nascimento).split("T")[0]
      : "",
    faixa: (professorData?.faixa || "").toString().trim().toUpperCase(),
    grau: professorData?.grau ?? 0,
  });

  const { addToast } = useToast();

  useEffect(() => {
    async function carregarFaixaGrau() {
      if (!professorData?.usuarioId) return;
      try {
        const { professor } = await buscarProfessorEUsuario(
          professorData.usuarioId
        );
        if (professor?.id) {
          setForm((prev) => ({
            ...prev,
            faixa: (professor.faixa || "").toString().trim().toUpperCase(),
            grau: professor.grau ?? prev.grau,
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar faixa do professor:", error);
      }
    }
    carregarFaixaGrau();
  }, [professorData?.usuarioId]);

  if (!professorData) {
    return <h2>Professor não encontrado</h2>;
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Atualiza dados do usuário (nome, email, telefone, nascimento)
      await api.patch(`user/${professorData.usuarioId}`, {
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        data_nascimento: form.data_nascimento || undefined,
      });

      // Atualiza dados do professor (faixa, grau)
      await atualizarProfessor(professorData.id, {
        faixa: form.faixa,
        grau: parseInt(form.grau),
      });

      addToast("Professor atualizado com sucesso!", "success");
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error(error);
      addToast("Erro ao atualizar professor.", "error");
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
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={handleChange}
              />
            </div>

            <div className="form__group form__group--full">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="email@morimitsu.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form__group">
              <label htmlFor="telefone">Telefone</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                placeholder="(XX) XXXXX-XXXX"
                value={form.telefone}
                onChange={handleChange}
              />
            </div>

            <div className="form__group form__group--full">
              <label htmlFor="data_nascimento">Data de Nascimento</label>
              <input
                type="date"
                id="data_nascimento"
                name="data_nascimento"
                value={form.data_nascimento}
                onChange={handleChange}
              />
            </div>

            <div className="form__group">
              <label htmlFor="grau">Grau</label>
              <input
                type="number"
                id="grau"
                name="grau"
                placeholder="Grau"
                value={form.grau}
                onChange={handleChange}
              />
            </div>

            <div className="form__group form__group--full">
              <label htmlFor="faixa">Faixa</label>
              <select
                id="faixa"
                name="faixa"
                value={form.faixa}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="BRANCA">Branca</option>
                <option value="CINZA">Cinza</option>
                <option value="AMARELA">Amarela</option>
                <option value="LARANJA">Laranja</option>
                <option value="VERDE">Verde</option>
                <option value="AZUL">Azul</option>
                <option value="ROXA">Roxa</option>
                <option value="MARROM">Marrom</option>
                <option value="PRETA">Preta</option>
              </select>
            </div>

            <div className="form__actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(-1)}
              >
                Descartar Alterações
              </button>
              <button type="submit" className="btn-primary">
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarProfessor;
