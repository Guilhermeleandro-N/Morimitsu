import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import logo from "../../assets/morimitsu.png";
import useToast from "../../components/Toast/useToast";
import "./EsqueciSenha.css";

function EsqueciSenha() {
  const navigate = useNavigate();
  const { mostrar } = useToast();
  const [email, setEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const { addToast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      addToast("Informe seu email.", "error");
      return;
    }

    if (!novaSenha || !confirmacao) {
      addToast("Preencha a nova senha e a confirmação.", "error");
      return;
    }

    if (novaSenha !== confirmacao) {
      addToast("As senhas não coincidem.", "error");
      return;
    }

    setCarregando(true);
    try {
      await authService.resetarSenha(email, novaSenha);
      addToast(
        "Senha redefinida com sucesso! Faça login com a nova senha.",
        "success",
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      addToast(
        error?.response?.data?.message || "Erro ao redefinir a senha.",
        "error",
      );
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
