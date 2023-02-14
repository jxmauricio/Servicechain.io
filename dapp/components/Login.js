import React,{useState} from 'react'
import { Form,Button,Container } from 'semantic-ui-react';
import Link from 'next/link';
import {auth} from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const signIn = async()=>{
        
        try{
            await signInWithEmailAndPassword(auth,email,password);
            router.push('/userIdentification');
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