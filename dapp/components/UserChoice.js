import { useAppContext } from '@/context/AppContext'
import React,{useEffect} from 'react'
import { Button } from 'semantic-ui-react'
import { useRouter } from 'next/router';
import { addDoc,collection,setDoc,doc  } from 'firebase/firestore';
import { db } from '@/config/firebase';

function UserChoice() {
  const {setUserData,userData,currWeb3} = useAppContext();
  const router = useRouter();
  const employeeCollection = doc(db,"Employees",userData.publicAddress);

  
  useEffect(() => {
    const update = async()=>{
      if(userData.role){
        const data = {...userData};
        await setDoc(employeeCollection,data);
        console.log("Data value inputted");       
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