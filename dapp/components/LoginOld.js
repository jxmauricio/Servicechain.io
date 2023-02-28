import React,{useState} from 'react'
import { Form,Button,Container } from 'semantic-ui-react';
import Link from 'next/link';
import {auth} from '../config/firebase';
import { signInWithEmailAndPassword,browserSessionPersistence,setPersistence } from 'firebase/auth';
import { useRouter } from 'next/router';
import checkUser from '@/helper/checkUser';
import { db } from '../config/firebase';
import { doc,collection,getDoc,query,where } from 'firebase/firestore';
import connectWallet from '@/helper/connectWallet';
import { useAppContext } from '@/context/AppContext';
function LoginOld() {
    const [currEmail, setCurrEmail] = useState('');
    const [password, setPassword] = useState('');
    const {setUserData,userData} = useAppContext();
    const router = useRouter();
   
    const signIn = async()=>{
        try{
            const docRef = doc(db,'Users',currEmail);
            const docSnap = await getDoc(docRef);
            //signs up the user into our authentication system then pushes them to our home page 
        
            await signInWithEmailAndPassword(auth, currEmail, password);
            
            const {email,firstName,lastName,orgAddress,publicAddress,role} = docSnap.data();
            setUserData({email,firstName,lastName,publicAddress,role})
            // router.push('/hub')
        } catch (error){
            console.error(error);

        }
      }

  return (
   
        <Form onSubmit={signIn} style={{top:'10px'}}>
            <Form.Input  label='Email' placeholder='Email' onChange={e=>setCurrEmail(e.target.value)}/>
            <Form.Input  label='Password' placeholder='Password' onChange={e=>setPassword(e.target.value)}/>
            <Button>Login!</Button>
            <label corner='right'>Don't have an account? Register <Link href='/signup'>Here</Link></label>
        </Form>

)
}

export default LoginOld;