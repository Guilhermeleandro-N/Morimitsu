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

    async function logout(){ 
        try{
            //console.log("Rodou 1")
            const refreshToken = localStorage.getItem("refreshToken");
            //console.log("Rodou 2")
            const response =  await api.post("auth/logout", {
                refreshToken
            })
            //console.log(response.data)
            //console.log(response); 
        }catch (error){
            console.log(error.response)
        } finally{
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken"); 
            setUser(null); 
        }
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

