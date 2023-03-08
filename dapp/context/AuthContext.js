import { createContext,useContext,useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,setPersistence, browserSessionPersistence } from "firebase/auth";
import {auth} from '@/config/firebase';
import { getDoc,setDoc,doc, collection, addDoc } from 'firebase/firestore';
import { db } from "@/config/firebase";
const AuthContext = createContext({});
import { useRouter } from "next/router";
export function AuthContextProvider({ children }) {
    setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });

    //state that holds data we need to put in firebase user collection
    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(true);
    const [orgChosen,setOrgChosen] = useState(false);
    const [userData,setUserData] = useState({});
    // console.log('orgChosen',orgChosen);
    console.log(userData)
    const router = useRouter();
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,async(user)=>{
            if(user){
                const ref = doc(db,'Users',user.uid)
                const snapShot = await getDoc(ref);
                setUserData(snapShot.data());
                setUser({
                    uid:user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    role: ""
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
      <AuthContext.Provider value={{user,login,signUp,logout,setUser,setOrgChosen,orgChosen,userData}}>
        {loading ? null : children}
      </AuthContext.Provider>
    );
  }
  
export const useAuth = ()=> useContext(AuthContext);