import React from 'react';
import factory from '../ethereum/factory';
import { Card,Button } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import Link from 'next/link';


export default function Home(props) {
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
  return (
    <>
      <h1>Organizations</h1>
      {renderServices()}
      
    </>
  )
}

Home.getInitialProps = async()=>{
    const services = await factory.methods.getDeployedServices().call();
    const orgNames = []
    for (let i =0;i<services.length;i++){
      orgNames.push(await factory.methods.orgNames(services[i]).call());
    }
    return {services,orgNames};
}
