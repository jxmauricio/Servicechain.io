import {React,useState,useEffect} from 'react';
import factory from '../../ethereum/factory';
import { Button,Confirm,Container,Dropdown,Icon,Segment,Grid,Divider} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import {auth, db} from '../../config/firebase'
import { getDoc,setDoc,doc,updateDoc,arrayUnion } from 'firebase/firestore';
import { useRouter } from 'next/router';

import { useAuth } from '@/context/AuthContext';
import UserAction from '@/components/UserAction';
//This page renders out the "home" page of our website
export default function home(props) {
  const [staging,setStaging] = useState(''); 
  const [currOrg,setCurrOrg] = useState ('');
  const [error,setError] = useState(false);
  const [userData,setUserData] = useState('');
  const {user,setOrgChosen} = useAuth();
  const [open, setOpen] = useState(false);
  const {uid} = props;

  const ref = doc(db,'Users',uid)
  const router = useRouter();
  useEffect(()=>{
    const getData = async()=>{
      const ref = doc(db,'Users',uid)
      const snapShot = await getDoc(ref);
      const userData = snapShot.data()
      setUserData(userData);
    }
    getData();
  },[currOrg])
  //loads the organizations that have been created into cards 
  const addresses = props.services;
   //get array of values that contain the visited org of the custopmer
  //then update the elements in the array if the organization picked is not currentley in the database

  const addVisited = async(addr)=>{
    await updateDoc(ref, {
      visitedOrgs: arrayUnion(addr)
  });
    
  }
  let items = addresses.map((address,index)=>{
      return{
          key: index,
          value: address,
          text: props.orgNames[index],
      };
  });
  const handleConfirm = async()=>{
    setOpen(false);
    await setDoc(ref,{orgAddress:staging},{merge:true});
    setCurrOrg(staging);
    if (userData.role != 'customer') {
      console.log('okay')
      router.reload(window.location.pathname);
    }
    
    
  }
  const handleCancel = ()=>{
    setOpen(false);
  }

  //renders ServiceCreation component if the user is a manager(meaning the manager should only be allowed to create organizations)
  //If the user is not a manager they get exposed to the organizations that have been created and are exposed to it 
  return (
   <Container style={{  padding: '70px 0',textAlign: 'center'}}>


      <h1>Welcome {userData.first} {userData.last}</h1>
    
      {!userData.orgAddress && userData.role!='customer' ? <h2>Make sure to pick your employer!</h2> : userData.role=='customer' ? <h3>Choose you organization</h3>:null  }
        {userData.role ==='customer' || !userData.orgAddress ? <><Dropdown placeholder ='Organization' search selection options={items} 
        onChange={(e,d)=>{
          setStaging(d.value);
          //updates the orgs the customer has visited for our stats page 
          addVisited(d.value);
          }}/> <Button primary onClick={()=>setOpen(true)}>Confirm</Button>
          <Confirm open={open} onCancel={handleCancel} onConfirm={handleConfirm}/> </> : null}
        
        
        {userData.role ==='manager' && !userData.orgAddress ?
         <>
         <Divider horizontal>Or</Divider>
      
         <Button size ='medium' color='teal' content='New Organization' onClick = {()=>{router.push(`/${uid}/ServiceCreation`)}} icon='add' labelPosition='left'/>
         </> 
         : null }
    
      {(currOrg && userData.role==='customer') || (userData.orgAddress && userData.role !='customer')  ?
      <Segment placeholder>
        <Grid columns={2} stackable textAlign='center'>
        <Divider vertical>Or</Divider>
        {<UserAction userData={userData} orgAddress={userData.role ==='customer' || !(userData.orgAddress) ? currOrg:userData.orgAddress} uid={uid} didSelect={currOrg ? true : false} setError={setError}/>}
        </Grid>
      </Segment>
      : null}
    </Container>
  )
}
//renders the services that have been deployed and their respective orgnames
//passes the data as props to the component above 
home.getInitialProps = async(props)=>{
    //grab data of the current logged in user
    const {uid} = props.query;
    const ref = doc(db,'Users',uid)
    const snapShot = await getDoc(ref);
    const userData = snapShot.data()
 
    //call data about the organizations 
    const services = await factory.methods.getDeployedServices().call();
    const orgNames = []
    for (let i =0;i<services.length;i++){
      orgNames.push(await factory.methods.orgNames(services[i]).call());
    }

    return {services,orgNames,userData,uid,ref};
}
