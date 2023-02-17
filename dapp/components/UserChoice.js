import { useAppContext } from '@/context/AppContext'
import React,{useEffect} from 'react'
import { Button } from 'semantic-ui-react'
import { useRouter } from 'next/router';
import { addDoc,collection,setDoc,doc  } from 'firebase/firestore';
import { db } from '@/config/firebase';
//this is the last component that is rendered after the signup flow
function UserChoice() {
  const {setUserData,userData,currWeb3} = useAppContext();
  const router = useRouter();
  //we use the public address of the users metamask account as a unique identifier in firestore
  const userCollection = doc(db,"Users",userData.publicAddress);

  //Once role is set to state then the useEffect runs and sends data to firestore about the user
  useEffect(() => {
    const update = async()=>{
      if(userData.role){
        const data = {...userData};
        await setDoc(userCollection,data);
        router.push('/hub'); 
      }
    }
    update();
  }, [userData])
 


  const handleClick  = async(e)=>{
    console.log(e.target.value);
    setUserData(prev => {return {...prev,role:e.target.value}});
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