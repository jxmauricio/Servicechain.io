
import React,{useEffect} from 'react'
import { Button } from 'semantic-ui-react'
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
//this is the last component that is rendered after the signup flow
function UserChoice(props) {
  const {setUserInfo,userInfo,setFourthIsFinished,setThirdIsFinished} = props
  const {signUp,setUser} = useAuth();
  //we use the public address of the users metamask account as a unique identifier in firestore
  const handleClick  = async(e)=>{
    setUserInfo(prev => {return {...prev,role:e.target.value}});
    await signUp(userInfo.email,userInfo.password);
  }

  return (
    
    <>
    <Button value='manager' onClick={e=>handleClick(e)}>Manager</Button>
    <Button value='employee' onClick={e=>handleClick(e)}>Employee</Button>
    <Button value='customer' onClick={e=>handleClick(e)}>Customer</Button>
    </>
  )
}

export default UserChoice;