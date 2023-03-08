import {React,useState,useEffect} from 'react';
import factory from '../../ethereum/factory';
import { Card,Button,Form,Input,Message,Container,Dropdown,Icon,Segment,Grid,Divider,Popup} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import Link from 'next/link';
import {auth, db} from '../../config/firebase'
import { getDoc,setDoc,doc, collection, addDoc,updateDoc,arrayUnion } from 'firebase/firestore';
import { useRouter } from 'next/router';
import ServiceCreation from '@/pages/[uid]/ServiceCreation';
import { useAuth } from '@/context/AuthContext';
import UserAction from '@/components/UserAction';
//This page renders out the "home" page of our website
export default function home(props) {
  const [orgName, setOrgName] = useState(''); 
  const [currOrg,setCurrOrg] = useState ('');
  const [error,setError] = useState(false);
  const {user,setOrgChosen} = useAuth();
  const {userData,uid} = props;
  console.log(uid)
  const ref = doc(db,'Users',uid)
  const router = useRouter();
  //loads the organizations that have been created into cards 
  const addresses = props.services;
  console.log(currOrg);
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


  //renders ServiceCreation component if the user is a manager(meaning the manager should only be allowed to create organizations)
  //If the user is not a manager they get exposed to the organizations that have been created and are exposed to it 
  return (
    <Container textAlign='center'>


      <h1>Welcome {userData.first} {userData.last}</h1>
      {userData.orgAddress && userData.role!='employee' ? null : <h2>Make sure to pick your employer!</h2>}
        {userData.role ==='customer' || !userData.orgAddress ? <Dropdown placeholder ='Organization' search selection options={items} 
        onChange={(e,d)=>{
          setDoc(ref,{orgAddress:d.value},{merge:true});
          setCurrOrg(d.value);
          //updates the orgs the customer has visited for our stats page 
          addVisited(d.value);
          }}/> : null}
        {userData.role ==='manager' && !userData.orgAddress ? 
         <Popup content='Add a new Organization!' trigger={
         <Button size ='medium' onClick = {()=>{router.push(`/${uid}/ServiceCreation`)}}>
         <Button.Content visible>
           <Icon name='plus' />
         </Button.Content>
         </Button>
        } />
         : null }
    

      <Segment placeholder>
        <Grid columns={2} stackable textAlign='center'>
        <Divider vertical>Or</Divider>
        {<UserAction userData={userData} orgAddress={userData.role ==='customer' ? currOrg:userData.orgAddress} uid={uid} didSelect={currOrg ? true : false} setError={setError}/>}
        </Grid>
      </Segment>
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
