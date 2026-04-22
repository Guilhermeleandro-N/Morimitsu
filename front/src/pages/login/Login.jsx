import {useState} from 'react'
import {useNavigate} from "react-router-dom";
import logo from "../../assets/morimitsu.png"
import "./login.css"
const Login = () => {
    console.log("login")
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState ("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    

    async function handleSubmit(e){
        e.preventDefault()
        try{
            const response = true;
            if (response){
                navigate("/");
            }else{
                setMessage("Nome ou senha inválidos.")
            }
        }catch(error){
            setMessage("Erro ao conectar com o servidor.")
        }     
    }
        
   
    
  return (
    <main className='container'>
        <div className='login-cards' >
            <img src={logo} alt="" />
            <h1>Morimitsu</h1>
            <form  onSubmit={handleSubmit}>
                <label htmlFor="email" >Email</label>
                <input type="email" id="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <label htmlFor="senha">Senha</label>
                <div>
                    
                    <input type={showPassword ? "text" : "password"} id="senha" placeholder="senha" value={senha} onChange={(e)=>setSenha(e.target.value)} required/>
                    <button type="button" className="toggle-password" onClick={()=> setShowPassword(!showPassword)}>👁</button>
                </div>
                <button type="submit" >Entrar</button>
            </form>
            {message && <p className='form-error'>{message}</p>}
            
        </div>
        <a href="#" className="forgot-password">
      Esqueci minha senha
    </a>
    </main>
  )
}

export default Login;