import React from 'react'
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import Link from 'next/link';
import { useRouter } from 'next/router';
import factory from '../../../ethereum/factory';
function hub(props) {
  //gets our current url
  const {asPath} = useRouter();
  return (
    <>
    <h3>What action would you like to do for {props.orgName}</h3>
     <Button>
        <Link href={`${asPath}/tip`}>
          Send Tip!
        </Link>
      </Button>
      <Button>
        <Link href={`${asPath}/rating`}>
            Send Rating!
        </Link>
      </Button>
      <Button>
        <Link href={`${asPath}/hours`}>
          Log Hours!
        </Link>
      </Button>
    
    </>
   
  )
}
hub.getInitialProps=async(props)=>{
  const {uid,address} = props.query.address;
  console.log(address)
  const orgName = await factory.methods.orgNames(address).call() 
  return {orgName,uid}
}

export default hub;