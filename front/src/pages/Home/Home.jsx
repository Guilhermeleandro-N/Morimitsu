import React from 'react'
import { criarUser } from '../../services/userService'
import { listarAlunosCompleto } from '../../services/alunoService'
import api from '../../api/axios'
import { atualizarAluno } from '../../services/alunoService'

/*
    usuarioId,
    nome,
    email,
    senha,
    telefone,
    data_nascimento,
    faixa,
    grau,
    frequencia_atual
*/

const user = {
  "id": "031a0800-972f-4ce3-b1fd-6a223cd3fb43",
  "nome": "Taciana Leandro ",
  "email": "taciana@morimitsu.com",
  "telefone": "88996343100",
  "status": "ENABLED",
  "roles": [
    "aluno"
  ],
  "frequencia_atual": 45,
  "grau_faixa": 1,
  "faixa": "branca",
  "data_nascimento": "2004-10-14T00:00:00.000Z",
  "usuarioId": "17e51c15-e275-4cf0-ad3c-56325dd379f6"
}
let senha = "Admin@123456"

const Home = () => {
  async function teste() {
    try{
    const response = await atualizarAluno(
      user.usuarioId,
      "Taciana Lima",
      user.email,
      senha,
      user.telefone,
      user.data_nascimento,
      user.faixa,
      user.grau_faixa,
      user.frequencia_atual
    )
    console.log(response)
    }catch(error){
      console.log(error)
    }
    
  }
  

  return (
    <div><button onClick={teste} >TESTE</button></div>
  )
}

export default Home