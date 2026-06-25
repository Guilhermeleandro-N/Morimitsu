import axios from "axios";
import API_BASE_URL from "../config/api";

const TOKEN_KEYS = Object.freeze({
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
});

const authService = {
  getAccessToken() {
    return localStorage.getItem(TOKEN_KEYS.ACCESS);
  },

  setAccessToken(token) {
    localStorage.setItem(TOKEN_KEYS.ACCESS, token);
    return token;
  },

  getRefreshToken() {
    return localStorage.getItem(TOKEN_KEYS.REFRESH);
  },

  setRefreshToken(token) {
    localStorage.setItem(TOKEN_KEYS.REFRESH, token);
    return token;
  },

  setTokens(accessToken, refreshToken) {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  },

  clearTokens() {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
  },

  hasTokens() {
    return !!(this.getAccessToken() && this.getRefreshToken());
  },

  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    const { data } = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      { refreshToken }
    );
    this.setAccessToken(data?.token);
    return data?.token ?? null;
  },
};

export default authService;
