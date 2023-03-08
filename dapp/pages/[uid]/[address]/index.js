import React from 'react'
import { Button, Container,Segment,Divider} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import Link from 'next/link';
import { useRouter } from 'next/router';
import factory from '../../../ethereum/factory';
import { doc,getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
function hub(props) {
  const {userData} = props;
  const {asPath} = useRouter();
  return (
    <Container textAlign='center'>
    <h3>What action would you like to do for {props.orgName}</h3>
     {userData.role === 'customer' ? 
     <div>
      <Button>
        <Link href={`${asPath}/tip`}>
          Send Tip!
        </Link>
      </Button>
      <Divider horizontal>Or</Divider>
      <Button>
        <Link href={`${asPath}/rating`}>
            Send Rating!
        </Link>
      </Button>
      </div>
      : null}
      {userData.role==='employee' ?
      <Button>
        <Link href={`${asPath}/hours`}>
          Log Hours!
        </Link>
      </Button> 
      : null}
      
    
    </Container>
   
  )
}
hub.getInitialProps=async(props)=>{
  const {uid,address} = props.query;
  const ref = doc(db,'Users',uid)
  const snapShot = await getDoc(ref);
  const userData = snapShot.data()
  console.log(address)
  const orgName = await factory.methods.orgNames(address).call() 
  return {orgName,uid,userData}
}

export default hub;