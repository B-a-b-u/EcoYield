import { useState } from "react";
import { createContext } from "react";
import { account } from "../config/appwrite";
import { ID } from "react-native-appwrite";

export const UserContext = createContext()

export const UserProvider = ({children}) =>{
    const [user, setUser] = useState(null);

    const login = async (email, password) =>{
        await account.createEmailPasswordSession(email, password);
        const response = await account.get();
        setUser(response);
    }

    const register = async (email, password) =>{
        try{
            await account.create(ID.unique(), email, password);
            await login(email,password);
        }
        catch(error){
            console.log(error.message);
        }
    }
    

    const logout = async () =>{

    }

    return(
        <UserContext.Provider value={{user, register, login, logout}}>
            {children}
        </UserContext.Provider>
    )

}