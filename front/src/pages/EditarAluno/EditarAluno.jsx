import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { atualizarAluno, BuscaAlunoPorUserId } from "../../services/alunoService";
import { useToast } from "../../context/ToastContext";

import addUser from "../../assets/addUser.png";
import "./EditarAluno.css";

const EditarAluno = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const alunoData = location.state;

  const [form, setForm] = useState({
    nome: alunoData?.nome || "",
    email: alunoData?.email || "",
    faixa: (alunoData?.faixa || "").toString().trim().toUpperCase(),
    telefone: alunoData?.telefone || "",
    grau: alunoData?.grau_faixa ?? "",
    frequencia: alunoData?.frequencia_atual || "",
    data_nascimento: alunoData?.data_nascimento
      ? String(alunoData.data_nascimento).split("T")[0]
      : "",
  });

  const { addToast } = useToast();

  useEffect(() => {
    async function carregarFaixaGrau() {
      if (!alunoData?.usuarioId) return;
      try {
        const aluno = await BuscaAlunoPorUserId(alunoData.usuarioId);
        if (aluno?.id) {
          setForm((prev) => ({
            ...prev,
            faixa: (aluno.faixa || "").toString().trim().toUpperCase(),
            grau: aluno.grau_faixa ?? prev.grau,
            frequencia: aluno.frequencia_atual ?? prev.frequencia,
          }));
        }
      } catch (error) {
        console.error("Erro ao carregar faixa do aluno:", error);
      }
    }
    carregarFaixaGrau();
  }, [alunoData?.usuarioId]);

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
        addToast("Aluno atualizado com sucesso!", "success");

        setTimeout(() => {
          navigate(-1);
        }, 2500);
      } else {
        addToast("Erro ao atualizar aluno.", "error");
      }
    } catch (error) {
      console.log(error);
      addToast("Erro ao conectar com o servidor.", "error");
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
