import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { atualizarAluno } from '../../services/alunoService';

import addUser from "../../assets/addUser.png";
import "./EditarAluno.css";

const EditarAluno = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const alunoData = location.state;

    // Proteção caso entre direto na rota
    if (!alunoData) {
        return <h2>Aluno não encontrado</h2>;
    }

    function formatarDataInput(data) {
        if (!data) return "";

        return data.split("T")[0];
    }

    const [form, setForm] = useState({
        nome: alunoData.nome || "",
        email: alunoData.email || "",
        faixa: alunoData.faixa || "",
        telefone: alunoData.telefone || "",
        grau: alunoData.grau_faixa || "",
        dataNascimento: formatarDataInput(alunoData.data_nascimento),
        frequencia: alunoData.frequencia_atual || ""
    });

    const [message, setMessage] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            const response = await atualizarAluno(
                alunoData.usuarioId,
                form.nome,
                form.email,
                "Admin@123456", // senha temporária
                form.telefone,
                form.dataNascimento,
                form.faixa,
                parseInt(form.grau),
                parseInt(form.frequencia)
            );

            if (response.status === 200) {

                setMessage("Aluno atualizado com sucesso");

                setTimeout(() => {
                    navigate(-1);
                }, 1500);

            } else {

                setMessage("Erro ao atualizar aluno");

            }

        } catch (error) {

            console.log(error);
            setMessage("Erro ao conectar com o servidor.");

        }

    }

    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
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
                        <div className="form__group">

                            <label htmlFor="email">E-mail</label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="email@example.com"
                                value={form.email}
                                onChange={handleChange}
                            />

                        </div>

                        {/* FAIXA */}
                        <div className="form__group">

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

                        {/* DATA NASCIMENTO */}
                        <div className="form__group">

                            <label htmlFor="dataNascimento">
                                Data de Nascimento
                            </label>

                            <input
                                type="date"
                                id="dataNascimento"
                                name="dataNascimento"
                                value={form.dataNascimento}
                                onChange={handleChange}
                            />

                        </div>

                        {/* FREQUÊNCIA */}
                        <div className="form__group">

                            <label htmlFor="frequencia">
                                Frequência Atual
                            </label>

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

                            <button
                                type="submit"
                                className="btn-primary"
                            >
                                Salvar Alterações
                            </button>

                        </div>

                        {message && (
                            <p className="message">
                                {message}
                            </p>
                        )}

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditarAluno;