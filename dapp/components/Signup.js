import React,{useState} from 'react';
import {Form,Button,label} from 'semantic-ui-react';
import Link from 'next/link';
import { getDocs,collection,addDoc } from 'firebase/firestore';
import {auth} from '../config/firebase';
import { useRouter } from 'next/router';
import { useAppContext } from '@/context/AppContext';
import ConnectWallet from './ConnectWallet';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import UserChoice from './UserChoice';

function Signup(props) {
  const [firstIsFinished, setFirstIsFinished] = useState(false);
  const [secondIsFinished, setSecondIsFinished] = useState(false);
  const [thirdIsFinished, setThirdIsFinished] = useState(false);
  const {userData,setUserData,currWeb3} = useAppContext();
  const [userInfo, setUserInfo] = useState({
    first:'',
    last:'',
    email:'',
    password:'',
    publicAddress:''});

    const signUp = async()=>{
        const {first,last,email,password} = userInfo;
        
        try {
            await createUserWithEmailAndPassword(auth,email,password);
            setFirstIsFinished(true)
            setSecondIsFinished(true)
            setUserData(prev=>{
              return{...prev,firstName:first,lastName:last,email:email}
            })

        } catch (error) {
            console.error(error);
        }
    }




  return (
    <div>
      {!firstIsFinished && <Form onSubmit={signUp} style={{top:'10px'}}>
          <Form.Input  label='First Name' placeholder='First Name' onChange={e=>setUserInfo((prev)=>{return {...prev,first:e.target.value} })} />
          <Form.Input  label='Last Name' placeholder='Last Name' onChange={e=>setUserInfo((prev)=>{return {...prev,last:e.target.value} })} />
          <Form.Input  label='Email' placeholder='Email' onChange={e=>setUserInfo((prev)=>{return {...prev,email:e.target.value} })} />
          <Form.Input  label='Password' placeholder='Password' onChange={e=>setUserInfo((prev)=>{return {...prev,password:e.target.value} })} />
          <Button >Sign Up!</Button>
          <label corner='right'>Already have an account? Login <Link href='/'>Here</Link></label>
      </Form>}
      {secondIsFinished && <ConnectWallet setSecondIsFinished={setSecondIsFinished}  setThirdIsFinished={setThirdIsFinished}/>}
      {thirdIsFinished && <UserChoice/>}  
    </div>
  )
}

export default Signup