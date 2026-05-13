import {createContext, useState, useEffect} from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    /*useEffect(() => {
        console.log("User atualizado:", user);
    }, [user]);*/

    async function login(email,senha){
        try {
            const response = await api.post("auth/login", {
                email, 
                senha
            })
            
            

            const data = response.data;

            

            localStorage.setItem(
                "accessToken",
                data.token
            );

            localStorage.setItem(
                "refreshToken",
                data.refreshToken
            );
            setUser(data);
            
            
            return true 
        } catch (error){
            console.log(error)
            return false
        }
        
    }

    function logout(){ 
            console.log(localStorage.removeItem("accessToken"))
            localStorage.removeItem("accessToken"); 
            console.log(localStorage.removeItem("accessToken")) 
            localStorage.removeItem("refreshToken"); setUser(null); 
        }
    

    return (
    <AuthContext.Provider
        value={{
            user,
            login,
            logout
        }}
    >
        {children}
    </AuthContext.Provider>
)
}

