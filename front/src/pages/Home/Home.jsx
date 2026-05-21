import React from 'react'
import { criarUser } from '../../services/userService'
import { listarAlunoCompleto } from '../../services/alunoService'
import api from '../../api/axios'
const Home = () => {
  async function teste() {
    /*const usuarioCriado =  await  criarUser("Edward60", "Guilherme60@email.com", "Senha@123", "(11) 99999-99100")
    const faixa = "Branca"
    const grau = 1
    const response = await api.post("aluno", {
                usuarioId: usuarioCriado.data.id,
                faixa: faixa,
                grau_faixa: grau 
                });
                console.log(response)
    /*console.log(`Status: ${usuarioCriado.status}`); 
    console.log("Data:\n"); 
    console.log(usuarioCriado.data)
    console.log(usuarioCriado.data.id)*/
    listarAlunoCompleto()
  }
  

  return (
    <div><button onClick={teste} >TESTE</button></div>
  )
}

export default Home