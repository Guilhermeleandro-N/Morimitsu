import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/"
});

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("accessToken");
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
            error.response.status === 401 &&
            !originalRequest._retry
        ){
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refreshToken");

            const response = await axios.post("http://localhost:3000/api/auth/refresh-token", {
                refreshToken
            });

            const newToken = response.data.token;

            localStorage.setItem(
                "accessToken",
                newToken
            );

            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return api(originalRequest);

        }

        return Promise.reject(error);

    }
);

export default api