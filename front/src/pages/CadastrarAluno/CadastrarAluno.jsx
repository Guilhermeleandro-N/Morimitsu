import React from 'react';
import { useState } from 'react';

import {useNavigate} from "react-router-dom";
import { BsPersonPlus } from "react-icons/bs";
import { FaRegCircle } from "react-icons/fa6";
import addUser from "../../assets/addUser.png"
import "./cadastrarAluno.css"
const CadastrarAluno = () => {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        faixa: "",
        telefone: "",
        grau: "",
        data_nasc: "",
        frequencia: ""
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const response = true;
            if (response){
                setMessage("Aluno cadastrado com sucesso");
            } else {
                setMessage("Erro ao cadastrar.");        
            }
        } catch (error){
            setMessage("Erro ao conectar com o servidor.")
        }
        
    }
    function handleChange(e){
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
    <h2 className="register__title">Cadastrar Aluno</h2>
    <p className="register__subtitle">
      Adicione um novo aluno ao sistema
    </p>
  </div>
</div>

    {/* FORM */}
    <form  onSubmit={handleSubmit}>
        <div className="register__form">
      {/* NOME */}
      <div className="form__group form__group--full">
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          name="nome"
          placeholder="Nome"
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
          placeholder="email@exemplo.com"
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
          placeholder="(85) 99999-9999"
          onChange={handleChange}
        />
      </div>

      {/* DATA NASCIMENTO */}
      <div className="form__group">
        <label htmlFor="dataNascimento">Data de nascimento</label>
        <input
          type="date"
          id="dataNascimento"
          name="dataNascimento"
          onChange={handleChange}
        />
      </div>

      {/* FAIXA */}
      <div className="form__group">
        <label htmlFor="faixa">Faixa atual</label>
        <select id="faixa" name="faixa" onChange={handleChange}>
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

      {/* GRAU */}
      <div className="form__group">
        <label htmlFor="grau">Grau atual</label>
        <select id="grau" name="grau" onChange={handleChange}>
          <option value="">Selecione</option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </div>

      {/* FREQUÊNCIA */}
      <div className="form__group">
        <label htmlFor="frequencia">Frequência semanal</label>
        <input
          type="number"
          id="frequencia"
          name="frequencia"
          placeholder="Ex: 3"
          onChange={handleChange}
        />
      </div>

      {/* BOTÃO */}
      </div>
<div className="form__actions">
  <button type="submit" className="btn-primary">
    Salvar Alterações
  </button>
</div>
    </form>
  </div>
</div>
     
  )
}

export default CadastrarAluno