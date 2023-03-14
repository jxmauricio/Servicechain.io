import React,{useState,useEffect} from 'react'
import { Form,Button,Message,label, Input,Container,Segment } from 'semantic-ui-react'
import web3 from '@/ethereum/web3';
import factory from '@/ethereum/factory';
import {usdToWei,options, weiToUsd} from '@/helper/conversions';
import axios from 'axios';
import { useRouter } from 'next/router';
import { db } from '@/config/firebase';
import { doc,setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

/* global BigInt */
function ServiceCreation(props) {
  const {usersRef,uid} = props;
  //used to handle errors
  const [orgName,setOrgName] = useState('');
  const [error,setError] = useState('');
  //used to prompt up loading circle for the button
  const [loading, setLoading] = useState(false);
  const [hourlyRate,setHourlyRate] = useState('');
  const {marketPrice} = useAuth();
  const [amount,setAmount]= useState('');
  const router = useRouter();


  const onSubmit = async(event)=>{
    event.preventDefault();
    setLoading(true);
    setError('');
    try{
        //gets the accounts linked to metamask
        const accounts = await web3.eth.getAccounts();
        const hourlyRateToWei = usdToWei(hourlyRate,marketPrice);
        const weiDeposit = usdToWei(amount,marketPrice);
        //creates the service and uses the first account in metamask to create it
        await factory.methods.createService(orgName,BigInt(hourlyRateToWei)).send({ from:accounts[0],value:weiDeposit});
        const services = await factory.methods.getDeployedServices().call();
        const addr = services[services.length-1]
        

        await setDoc(usersRef,{orgAddress:addr},{merge:true});
        router.push(`/${uid}/home`)
    } catch(err){
        setError(err.message);

    }

    setLoading(false);
  }



  return (
    <Container textAlign='center'>
      <h1>Create a Service</h1>
    <Segment>
      
        <Form onSubmit={onSubmit} error={error ? true : false}>
            <Form.Field>
                <label>Organization Name</label>
                <Input
                 value ={orgName}
                 onChange={event=>setOrgName(event.target.value)}
                />
                <label>Hourly Rate Of Employees</label>
                <Input
                 label = 'USD'
                 labelPosition='right'
                 value ={hourlyRate}
                 onChange={event=>setHourlyRate(event.target.value)}
                />
                <label>Initial Deposit Amount</label>
                 <Input
                 label = 'USD'
                 labelPosition='right'
                 value ={amount}
                 onChange={event=>setAmount(event.target.value)}
                />
            </Form.Field>
            <Message error header = 'Oops!' content = {error}/>
            <Button primary loading={loading}>Create!</Button>
        </Form>
      </Segment>  
      
    </Container>
  )
}

ServiceCreation.getInitialProps = async(props)=>{
const {uid} = props.query;
const usersRef= doc(db,"Users",uid);
return {usersRef,uid}
}

export default ServiceCreation;