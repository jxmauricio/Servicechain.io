import {React,useState,useEffect} from 'react';
import factory from '../../ethereum/factory';
import { Card,Button,Form,Input,Message,Container } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import Link from 'next/link';
import {auth, db} from '../../config/firebase'
import { getDoc,setDoc,doc, collection, addDoc } from 'firebase/firestore';

import ServiceCreation from '@/components/ServiceCreation';
import { useAuth } from '@/context/AuthContext';

//This page renders out the "home" page of our website
export default function Home(props) {
  const [orgName, setOrgName] = useState(''); 
  const {user} = useAuth();
  const {userData,uid} = props;
  const ref = doc(db,'Users',uid)
  //loads the organizations that have been created into cards 
  const renderServices=()=>{
    const addresses = props.services;
    let items = addresses.map((address,index)=>{
        return{
            header: props.orgNames[index],
            description:<Link href={userData.role=='customer'? `/${uid}/${address}`:`${uid}/${address}/hours`}>
              <Button onClick={()=>{setDoc(ref,{orgAddress:address},{merge:true})}} primary>
                Choose Organization
              </Button>
              </Link>,
            fluid:true
        };
    });
    return <Card.Group items={items} />
  }

  //renders ServiceCreation component if the user is a manager(meaning the manager should only be allowed to create organizations)
  //If the user is not a manager they get exposed to the organizations that have been created and are exposed to it 
  return (
    <Container>
      {user?.role =='manager' ?
      <ServiceCreation setOrgName={setOrgName} orgName = {orgName}/>
      :
      <div>
        <h1>Organizations</h1>
        {renderServices()}
      </div> 
      }
      
    </Container>
  )
}
//renders the services that have been deployed and their respective orgnames
//passes the data as props to the component above 
Home.getInitialProps = async(props)=>{
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
