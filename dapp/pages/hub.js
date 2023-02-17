import {React,useState} from 'react';
import factory from '../ethereum/factory';
import { Card,Button,Form,Input,Message,Container } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import Link from 'next/link';
import web3 from '@/ethereum/web3';
import {auth, db} from '../config/firebase'
import { getDoc,setDoc,doc, collection, addDoc } from 'firebase/firestore';
import { useAppContext } from '@/context/AppContext';
import ServiceCreation from '@/components/ServiceCreation';



//This page renders out the "home" page of our website
export default function Home(props) {
  const [orgName, setOrgName] = useState('');

  const {userData,setUserData} = useAppContext();
  
  console.log(userData.publicAddress)
  //reference the users collection in firestore 
  const ref = doc(db,'Users',userData.publicAddress)
  //loads the organizations that have been created into cards 
  const renderServices=()=>{
    const addresses = props.services;
    console.log(props.orgNames)
    let items = addresses.map((address,index)=>{
        return{
            header: props.orgNames[index],
            description:<Link href={userData.role=='customer'? `/${address}`:`/${address}/hours`}>
              <Button onClick={()=>{setUserData(prev=>{ 
                setDoc(ref,{orgAddress:address},{merge:true})
                return {...prev,orgAddress:address}})
              }
                } primary>
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
      {userData.role =='manager' && <ServiceCreation setOrgName={setOrgName}/>}
      {userData.role !='manager' &&
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
Home.getInitialProps = async()=>{
    const services = await factory.methods.getDeployedServices().call();
    console.log(factory.methods.getDeployedServices());
    const orgNames = []
    for (let i =0;i<services.length;i++){
      orgNames.push(await factory.methods.orgNames(services[i]).call());
    }
    return {services,orgNames};
}
