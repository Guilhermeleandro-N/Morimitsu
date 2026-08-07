import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import logo from "../../assets/morimitsu.png";
import "./EsqueciSenha.css";

function EsqueciSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setTipoMensagem("");

    if (!email) {
      setMessage("Informe seu email.");
      setTipoMensagem("error");
      return;
    }

    if (!novaSenha || !confirmacao) {
      setMessage("Preencha a nova senha e a confirmação.");
      setTipoMensagem("error");
      return;
    }

    if (novaSenha !== confirmacao) {
      setMessage("As senhas não coincidem.");
      setTipoMensagem("error");
      return;
    }

    setCarregando(true);
    try {
      await authService.resetarSenha(email, novaSenha);
      setMessage("Senha redefinida com sucesso! Faça login com a nova senha.");
      setTipoMensagem("success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Erro ao redefinir a senha."
      );
      setTipoMensagem("error");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="container">
      <div className="login-cards">
        <img src={logo} alt="" />
        <h1>Redefinir Senha</h1>
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

          <label htmlFor="novaSenha">Nova senha</label>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              id="novaSenha"
              placeholder="nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
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

          <label htmlFor="confirmacao">Confirmar nova senha</label>
          <div>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmacao"
              placeholder="confirme a nova senha"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
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

          <button type="submit" disabled={carregando}>
            {carregando ? "Redefinindo..." : "Redefinir senha"}
          </button>
        </form>
        {message && (
          <p className={`form-error ${tipoMensagem}`}>{message}</p>
        )}
        <a
          className="forgot-password"
          onClick={() => navigate("/login")}
          style={{ cursor: "pointer" }}
        >
          Voltar para o login
        </a>
      </div>
    </main>
  );
}

export default EsqueciSenha;
