import useState from 'react'
import {useNavigate} from "react-router-dom";
import logo from "../../assets/morimitsu.png"
const Login = () => {
    console.log("login")
    const [email, setEmail] = useState("");
    const [senha, setSena] = useState ("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const response

    async function handleSubmit(e){
        try{
            const response = true;
            if (response){
                navigate("/home");
            }else{
                setMessage(data.message || "Nome ou senha inválidos.")
            }
        }catch(error){
            setMessage("Erro ao conectar com o servidor.")
        }     
    }
        
   
    
  return (
    <main className='container'>
        <div className='login-cards' onSubmit={() => {handleSubmit()}}>
            <img src={logo} alt="" />
            <h1>Morimitsu</h1>
            <form action="">
                <label htmlFor="email" >Email</label>
                <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <label htmlFor="senha">Senha</label>
                <div>
                    
                    <input type="password" placeholder="senha" value={senha} onChange={(e)=>senhal(e.target.value)} required/>
                </div>
            </form>
            {message && <p className='form-error'>{message}</p>}
            <button type="submit" >Entrar</button>
        </div>
    </main>
  )
}

export default Login;