import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import authService from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  /*useEffect(() => {
        console.log("User atualizado:", user);
    }, [user]);*/

  async function login(email, senha) {
    try {
      const response = await api.post("auth/login", {
        email,
        senha,
      });

      const data = response.data;

      authService.setTokens(data.token, data.refreshToken);

      setUser(data);

      return response;
    } catch (error) {
      return error;
    }
  }

  async function logout() {
    try {
      const refreshToken = authService.getRefreshToken();
      await api.post("auth/logout", {
        refreshToken,
      });
    } catch (error) {
      console.log(error.response);
    } finally {
      authService.clearTokens();
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
