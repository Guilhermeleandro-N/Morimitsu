import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/morimitsu.png";
import "./Login.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { addToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, senha);
      addToast("Login realizado com sucesso!", "success");
      navigate("/");
    } catch (error) {
      if (!error.response) {
        addToast(
          "Não foi possível conectar ao servidor. Verifique se o backend está ativo.",
          "error",
        );
      } else if (error.response?.status === 401) {
        addToast("E-mail ou senha inválidos. Tente novamente.", "error");
      } else if (error.response?.status >= 500) {
        addToast(
          "Erro interno no servidor. Tente novamente mais tarde.",
          "error",
        );
      } else {
        addToast(
          error.response?.data?.message || "Erro ao fazer login.",
          "error",
        );
      }
    }
  }

  return (
    <main className="login-container">
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
      </div>
      <a
        className="forgot-password"
        onClick={() => navigate("/esqueciSenha")}
        style={{ cursor: "pointer" }}
      >
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
