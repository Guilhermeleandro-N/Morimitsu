import React from 'react'
import { criarUser } from '../../services/userService'
import { listarAlunosCompleto } from '../../services/alunoService'
import api from '../../api/axios'
import { atualizarAluno } from '../../services/alunoService'
import { AtualizarTurma } from '../../services/turmaService'
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

const turma  = {
  "id": "cc347247-62da-4c92-b51d-2a06dc351f62",
  "nome": "Guilherme Leandro",
  "horario_inicio": "2026-05-28T16:00:00.027Z",
  "horario_fim": "2026-05-28T18:00:00.027Z",
  "data_especifica": "2026-05-24T00:00:00.000Z",
  "segunda": true,
  "terca": false,
  "quarta": false,
  "quinta": false,
  "sexta": false,
  "sabado": false,
  "domingo": true
}
//let senha = "Admin@123456"

const Home = () => {
  async function teste() {
    try{
    const response = await AtualizarTurma(
      turma.id,
      turma.nome,
      turma.horario_inicio,
      turma.horario_fim,
      turma.segunda,
      turma.terca,
      turma.quarta,
      turma.quinta,
      turma.sexta,
      turma.sabado,
      turma.domingo


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