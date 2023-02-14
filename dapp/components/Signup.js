import React,{useState} from 'react';
import {Form,Button,label} from 'semantic-ui-react';
import Link from 'next/link';
import {signUpWithEmailAndPassword,signInWithPopup} from 'firebase/auth';
import { getDocs,collection,addDoc } from 'firebase/firestore';
import auth from '../config/firebase';
import { useRouter } from 'next/router';



function Signup() {
    
  const [userInfo, setUserInfo] = useState({
    first:'',
    last:'',
    email:'',
    password:''});
    const router = useRouter();
    const signUp = async()=>{
        const {first,last,email,password} = userInfo;
        
        try {
            await signUpWithEmailAndPassword(auth,email,password);
            router.push(`/userIdentification`);
        } catch (error) {
            console.error(error);
        }
    }
    
  return (
    <Form onSubmit={signUp} style={{top:'10px'}}>
        <Form.Input  label='First Name' placeholder='First Name' onChange={e=>setUserInfo({...data,first:e.target.value})} />
        <Form.Input  label='Last Name' placeholder='Last Name' onChange={e=>setUserInfo({...data,last:e.target.value})} />
        <Form.Input  label='Email' placeholder='Email' onChange={e=>setUserInfo({...data,email:e.target.value})} />
        <Form.Input  label='Password' placeholder='Password' onChange={e=>setUserInfo({...data,password:e.target.value})} />
        <Button >Sign Up!</Button>
        <label corner='right'>Already have an account? Login <Link href='/'>Here</Link></label>
</Form>
  )
}

export default Signup