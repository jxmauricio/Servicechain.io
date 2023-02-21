
import service from '@/ethereum/service';
import web3 from '@/ethereum/web3';
import React from 'react'
import { Button } from 'semantic-ui-react';
function eventTest() {
  const mcdonaldAddress = '0xa6d6151b24CcfDba289A9B5131330Ca27d3fBa57'
  const test = async ()=>{
    const contract  = await service(mcdonaldAddress);
    const accounts = await web3.eth.getAccounts();
    //this is how you read events that have just been created 
    // const rec = await contract.methods.sendRatings('0x8d77A1962a6214d7f5FDEd8364eD4260833f06E8','0x875439656098eBAF5F9d1908441Ab29C4A8Eb96A',2).send({from:accounts[0]});
    // console.log(rec.events)

  contract.getPastEvents('submitRating',{filter: {from:"0x875439656098eBAF5F9d1908441Ab29C4A8Eb96A"}, fromBlock:0}).then(event=>console.log(event));
  console.log('hi')
    // console.log(pastEvents);
    contract.events.submitRating(() => {
    }).on("connected", function(subscriptionId){
        console.log('SubID: ',subscriptionId);
    })
    .on('data', function(event){
        console.log('Event:', event);
        console.log('Owner Wallet Address: ',event.returnValues.rating);
        //Write send email process here!
    })
    .on('changed', function(event){
        //Do something when it is removed from the database.
    })
    .on('error', function(error, receipt) {
        console.log('Error:', error, receipt);
    });;
  }

  return (
    <div>
        <Button onClick={test}>eventTest</Button>
        
        
    </div>
  )
 
}

export default eventTest;
