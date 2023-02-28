import { createContext,useContext,useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut } from "firebase/auth";
import {auth} from '@/config/firebase';
import { getDoc,setDoc,doc, collection, addDoc } from 'firebase/firestore';
import { db } from "@/config/firebase";
const AuthContext = createContext({});
import { useRouter } from "next/router";
export function AuthContextProvider({ children }) {
    //state that holds data we need to put in firebase user collection
    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(true);
    const router = useRouter();
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            if(user){
                setUser({
                    uid:user.uid,
                    email: user.email,
                    displayName: user.displayName,
                })
            }else{
                setUser(null);
            }
            setLoading(false);
        })
        return ()=>unsubscribe();
    },[])
    const signUp = async(email,password)=>{
        return createUserWithEmailAndPassword(auth,email,password);

    }
    const login = async(email,password)=>{
       return signInWithEmailAndPassword(auth,email,password);

    }
    const logout = async()=>{
        setUser(null);
        await signOut(auth);
    }
    return (
      <AuthContext.Provider value={{user,login,signUp,logout}}>
        {loading ? null : children}
      </AuthContext.Provider>
    );
  }
  
export const useAuth = ()=> useContext(AuthContext);