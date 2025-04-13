import { useState, useEffect, useContext, createContext, Children } from "react";
import { signOut, onAuthStateChanged } from "@firebase/auth";
import {auth} from '../config/firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);
const [authLoading, setAuthLoading] = useState(true);

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userInfo = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          };
          setUser(userInfo);
          await AsyncStorage.setItem('user', JSON.stringify(userInfo));
        } else {
          setUser(null);
          await AsyncStorage.removeItem('user');
        }
        setAuthLoading(false);
      });

      (async () => {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser && !user) {
          setUser(JSON.parse(storedUser));
          setAuthLoading(false);
        }
      })();
  
      return () => unsubscribe();
    
}, [])

const logout = async () => {
    await signOut(auth);
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

    return(
        <AuthContext.Provider  value={{ user, setUser, logout, authLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);
export { AuthProvider, useAuth };
