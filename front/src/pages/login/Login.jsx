import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/morimitsu.png";
import "./Login.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { user } = useContext(AuthContext);

  console.log(user);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await login(email, senha);
      console.log("----------------");
      console.log("----------------");
      if (response.status >= 200 && response.status < 300) {
        navigate("/");
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      setMessage(error.message || "Erro ao conectar com o servidor.");
    }
  }

  return (
    <main className="container">
      <div className="login-cards">
        <img src={logo} alt="" />
        <h1>Morimitsu</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="senha">Senha</label>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              id="senha"
              placeholder="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </button>
          </div>
          <button type="submit">Entrar</button>
        </form>
        {message && <p className="form-error">{message}</p>}
      </div>
      <a href="#" className="forgot-password">
        Esqueci minha senha
      </a>
      <a
        className="forgot-password"
        onClick={() => navigate("/cadastrarUsuario")}
        style={{ cursor: "pointer" }}
      >
        Cadastrar-se
      </a>
    </main>
  );
};

export default Login;
