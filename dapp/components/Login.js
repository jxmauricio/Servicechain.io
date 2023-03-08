import React,{useEffect, useState} from 'react'
import { Form,Button,Container,Message } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
function Login() {
    const {user,login,logout,signup} = useAuth();
    const [currEmail, setCurrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState('');
    const router = useRouter();
    
    useEffect(() => {
        
      const enterHub = async()=>{
        if (user){
            router.push(`${user.uid}/home`);
        } else {
            null
        }
      }
    enterHub()
    } , [user])
    
    const handleLogin = async()=>{
        setLoading(true);
        try{
            console.log(currEmail,password)
            await login(currEmail, password);
          
        } catch (error){
            setError(error.message);

        }
        setLoading(false);
      }
  return (
   
        <Form onSubmit={handleLogin} style={{top:'10px'}} error ={error ? true : false}>
            <Form.Input  label='Email' placeholder='Email' onChange={e=>setCurrEmail(e.target.value)}/>
            <Form.Input  label='Password' placeholder='Password' onChange={e=>setPassword(e.target.value)}/>
            <Button primary loading={loading}>Login!</Button>
            <label corner='right'>Don't have an account? Register <Link href='/signup'>Here</Link></label>
            <Message error header='Oops!' content = {error}/>
        </Form>

)
}

export default Login;