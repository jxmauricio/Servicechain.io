import React, {useState,useEffect } from 'react';
import { Container} from 'semantic-ui-react';
import UserChoice from '@/components/UserChoice';
import ConnectWallet from '@/components/ConnectWallet';
import {setDoc,doc} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import InputInfo from '@/components/InputInfo';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/router';

function signup() {
  const {signUp,user} = useAuth();
  const router = useRouter();
  const [firstIsFinished, setFirstIsFinished] = useState(false);
  const [secondIsFinished, setSecondIsFinished] = useState(false);
  const [thirdIsFinished, setThirdIsFinished] = useState(false);
  const [finished,setFinished] = useState(false);
  //after states are filled push it into firestore
  const [userInfo, setUserInfo] = useState({
    first:'',
    last:'',
    email:'',
    password:'',
    publicAddress:'',
    orgAddress:'',
    role:''});  

    //Once role is set to state then the useEffect runs and sends data to firestore about the user
  useEffect(() => {
    const update = async()=>{
      if(userInfo.role){
        const data = {...userInfo};
        const userCollection = doc(db,"Users",user.uid);
        await setDoc(userCollection,data);
        router.push(`${user.uid}/home`);  
      }
    }
    update(); 
  }, [finished])




  return (
    <Container>
        {!firstIsFinished && <InputInfo setFirstIsFinished={setFirstIsFinished} setSecondIsFinished={setSecondIsFinished} setUserInfo={setUserInfo} userInfo={userInfo}/>}
        {secondIsFinished && <ConnectWallet setSecondIsFinished={setSecondIsFinished}  setThirdIsFinished={setThirdIsFinished} setUserInfo={setUserInfo} userInfo={userInfo}/>}
        {thirdIsFinished && <UserChoice setUserInfo={setUserInfo} userInfo={userInfo} setThirdIsFinished={setThirdIsFinished} setFinished = {setFinished}/>}  
    </Container>
  )
}

export default signup;