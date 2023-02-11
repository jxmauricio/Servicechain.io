import {React,useState} from 'react';
import factory from '../ethereum/factory';
import { Card,Button,Form,Input,Message } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import Link from 'next/link';
import web3 from '@/ethereum/web3';

export default function Home(props) {
  const [orgName, setOrgName] = useState('');
  const [error,setError] = useState('');
  const [loading, setLoading] = useState(false);
  const renderServices=()=>{
    const addresses = props.services;
    console.log(props.orgNames)
    let items = addresses.map((address,index)=>{
        return{
            header: props.orgNames[index],
            description:<Link href={`/${address}`}>Address: {address}</Link>,
            fluid:true
        };
    });
    return <Card.Group items={items} />
  }

  const onSubmit = async(event)=>{
    event.preventDefault();
    setLoading(true);
    setError('');
    try{
        const accounts = await web3.eth.getAccounts();
        await factory.methods.createService(orgName)
        .send({
            from:accounts[0]
            });
    } catch(err){
        setError(err.message);

    }
    setLoading(false);
  }



  return (
    <>
        <h3>Create a Service</h3>
        <Form onSubmit={onSubmit} error={error ? true : false}>
            <Form.Field>
                <label>Organization Name</label>
                <Input
                 label = 'wei'
                 labelPosition='right'
                 value ={orgName}
                 onChange={event=>setOrgName(event.target.value)}
                />
            </Form.Field>
            <Message error header = 'Oops!' content = {error}/>
            <Button primary loading={loading}>Create!</Button>
        </Form>
      <h1>Organizations</h1>
      {renderServices()}
      
    </>
  )
}

Home.getInitialProps = async()=>{
    const services = await factory.methods.getDeployedServices().call();
    console.log(factory.methods.getDeployedServices());
    const orgNames = []
    for (let i =0;i<services.length;i++){
      orgNames.push(await factory.methods.orgNames(services[i]).call());
    }
    return {services,orgNames};
}
