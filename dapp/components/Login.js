import React,{useState} from 'react'
import { Form,Button,Container } from 'semantic-ui-react';
import Link from 'next/link';
import {auth} from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import checkUser from '@/helper/checkUser';
import { db } from '../config/firebase';
import { doc,collection } from 'firebase/firestore';
import connectWallet from '@/helper/connectWallet';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const signIn = async()=>{
        const ref = collection(db,'E')
        try{
            //signs up the user into our authentication system then pushes them to our home page 
            await signInWithEmailAndPassword(auth,email,password);
            router.push('/hub')
        } catch (error){
            console.error(error);

        }
      }

  return (
   
        <Form onSubmit={signIn} style={{top:'10px'}}>
            <Form.Input  label='Email' placeholder='Email' onChange={e=>setEmail(e.target.value)}/>
            <Form.Input  label='Password' placeholder='Password' onChange={e=>setPassword(e.target.value)}/>
            <Button>Login!</Button>
            <label corner='right'>Don't have an account? Register <Link href='/signup'>Here</Link></label>
        </Form>

)
}

export default Login;