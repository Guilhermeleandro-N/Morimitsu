import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { atualizarAluno } from "../../services/alunoService";

import addUser from "../../assets/addUser.png";
import useToast from "../../components/Toast/useToast";
import "./EditarAluno.css";

const EditarAluno = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const alunoData = location.state;

  const [form, setForm] = useState({
    nome: alunoData?.nome || "",
    email: alunoData?.email || "",
    faixa: alunoData?.faixa || "",
    telefone: alunoData?.telefone || "",
    grau: alunoData?.grau_faixa || "",
    frequencia: alunoData?.frequencia_atual || "",
    data_nascimento: alunoData?.data_nascimento
      ? String(alunoData.data_nascimento).split("T")[0]
      : "",
  });

  const { mostrar } = useToast();

  // Proteção caso entre direto na rota
  if (!alunoData) {
    return <h2>Aluno não encontrado</h2>;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await atualizarAluno(
        alunoData.usuarioId,
        form.nome,
        form.email,
        "Admin@123456", // senha temporária
        form.telefone,
        form.data_nascimento,
        form.faixa,
        parseInt(form.grau),
        parseInt(form.frequencia),
      );

      if (response.status === 200) {
        mostrar("Aluno atualizado com sucesso!", "success");

        setTimeout(() => {
          navigate(-1);
        }, 2500);
      } else {
        mostrar("Erro ao atualizar aluno.", "error");
      }
    } catch (error) {
      console.log(error);
      mostrar("Erro ao conectar com o servidor.", "error");
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div className="register">
      <div className="register__container">
        {/* HEADER */}
        <div className="register__header">
          <div className="register__icons">
            <img src={addUser} alt="" />
          </div>

          <div className="register__header-text">
            <h2 className="register__title">Editar Aluno</h2>

            <p className="register__subtitle">
              Edite dados de um aluno no sistema
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="register__form">
            {/* NOME */}
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

            {/* EMAIL */}
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

            {/* TELEFONE */}
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

            {/* GRAU */}
            <div className="form__group">
              <label htmlFor="grau">Grau Atual</label>

              <input
                type="number"
                id="grau"
                name="grau"
                placeholder="Grau"
                value={form.grau}
                onChange={handleChange}
              />
            </div>

            {/* DATA DE NASCIMENTO */}
            <div className="form__group">
              <label htmlFor="data_nascimento">Data de Nascimento</label>

              <input
                type="date"
                id="data_nascimento"
                name="data_nascimento"
                value={form.data_nascimento}
                onChange={handleChange}
              />
            </div>

            {/* FAIXA */}
            <div className="form__group form__group--full">
              <label htmlFor="faixa">Faixa Atual</label>

              <select
                id="faixa"
                name="faixa"
                value={form.faixa}
                onChange={handleChange}
              >
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

            {/* FREQUÊNCIA */}
            <div className="form__group">
              <label htmlFor="frequencia">Frequência Atual</label>

              <input
                type="number"
                id="frequencia"
                name="frequencia"
                placeholder="XX presenças"
                value={form.frequencia}
                onChange={handleChange}
              />
            </div>

            {/* BOTÕES */}
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

export default EditarAluno;
