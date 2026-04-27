import React from 'react';
import { useState } from 'react';

import {useNavigate} from "react-router-dom";

import addUser from "../../assets/addUser.png"
import "./EditarAluno.css"
const EditarAluno = () => {
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
    <h2 className="register__title">Editar Aluno</h2>
    <p className="register__subtitle">
      Edite dados de um aluno no sistema
    </p>
  </div>
</div>
{/* O FORM deve apenas envolver e lidar com o submit */}
<form onSubmit={handleSubmit}>
  {/* Esta DIV é quem controla o GRID */}
  <div className="register__form">
    
    {/* NOME (Adicione a classe aqui) */}
    <div className="form__group form__group--full">
      <label htmlFor="nome">Nome</label>
      <input type="text" id="nome" name="nome" placeholder="Nome" onChange={handleChange} />
    </div>

    {/* ... (os outros campos, sem mudar nada, pois já estão com form__group) ... */}
    
    <div className="form__group">
      <label htmlFor="email">E-mail</label>
      <input type="email" id="email" name="email" placeholder="email@example.com" onChange={handleChange} />
    </div>

    {/* FAIXA (Adicione a classe form__group) */}
    <div className="form__group">
      <label htmlFor="faixa">Faixa Atual</label>
      <select id="faixa" name="faixa" onChange={handleChange}>
         {/* suas opções */}
      </select>
    </div>

    {/* TELEFONE */}
    <div className="form__group">
      <label htmlFor="telefone">Telefone</label>
      <input type="tel" id="telefone" name="telefone" placeholder="(XX) XXXX-XXXX" onChange={handleChange} />
    </div>

    {/* GRAU */}
    <div className="form__group">
      <label htmlFor="grau">Grau Atual</label>
      <select id="grau" name="grau" onChange={handleChange}>
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

    {/* DATA NASCIMENTO */}
    <div className="form__group">
      <label htmlFor="dataNascimento">Data de Nascimento</label>
      <input type="date" id="dataNascimento" name="dataNascimento" onChange={handleChange} />
    </div>

    {/* FREQUÊNCIA */}
    <div className="form__group">
      <label htmlFor="frequencia">Frequência Atual</label>
      <input type="number" id="frequencia" name="frequencia" placeholder="XX presenças" onChange={handleChange} />
    </div>

    {/* BOTÕES */}
    <div className="form__actions">
      <button type="button" className="btn-secondary">Descartar Alterações</button>
      <button type="submit" className="btn-primary">Salvar Alterações</button>
    </div>

  </div>
</form>
  </div>
</div>


     
  )
}

export default EditarAluno;