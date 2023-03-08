import React,{useState,useEffect} from 'react'
import { Form,Button,Message,label, Input,Container } from 'semantic-ui-react'
import web3 from '@/ethereum/web3';
import factory from '@/ethereum/factory';
import {usdToWei,options} from '@/helper/conversions';
import axios from 'axios';
function ServiceCreation() {
  //used to handle errors
  const [orgName,setOrgName] = useState('');
  const [error,setError] = useState('');
  //used to prompt up loading circle for the button
  const [loading, setLoading] = useState(false);
  const [hourlyRate,setHourlyRate] = useState('');
  const [marketPrice, setMarketPrice] = useState('');
  useEffect(() => {
    return async() => {
      const response = await axios.request(options);
      setMarketPrice(response.data.ethereum.usd);
    }
  }, [loading])
  
  const onSubmit = async(event)=>{
    event.preventDefault();
    setLoading(true);
    setError('');
    try{
        //gets the accounts linked to metamask
        const accounts = await web3.eth.getAccounts();
        const hourlyRateToWei = usdToWei(hourlyRate,marketPrice);
        console.log(orgName,hourlyRateToWei);
        //creates the service and uses the first account in metamask to create it
        await factory.methods.createService(orgName,hourlyRateToWei).send({ from:accounts[0]});
    } catch(err){
        setError(err.message);

    }
    setLoading(false);
  }



  return (
    <Container><h1>Create a Service</h1>
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
            </Form.Field>
            <Message error header = 'Oops!' content = {error}/>
            <Button primary loading={loading}>Create!</Button>
        </Form>
    </Container>
  )
}

export default ServiceCreation;