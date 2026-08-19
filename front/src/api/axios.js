import axios from "axios";
import authService from "../services/authService";
import API_BASE_URL from "../config/api";

const api = axios.create({
    baseURL: `${API_BASE_URL}/`
});

api.interceptors.request.use((config)=>{
    const token = authService.getAccessToken();
    if (token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
    response => response,

    async error => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            originalRequest?.url !== "auth/login" &&
            !originalRequest?._retry
        ){
            originalRequest._retry = true;

            try {
                const newToken = await authService.refreshAccessToken();

                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                authService.clearTokens();
                localStorage.removeItem("user");
                window.dispatchEvent(new Event("session-expired"));
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api