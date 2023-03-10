import React from 'react'
import { Button, Container,Segment,Divider,Grid,Header,Icon} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { doc } from 'firebase/firestore';
import { db } from '@/config/firebase';
function UserAction(props) {
  const {userData,orgAddress,uid} = props;

 
  return (
    <Grid.Row verticalAlign='middle'>
    { userData.role === 'manager' ?
        <>
        <Grid.Column>
          <Header icon>
            <Icon name='search' />
            Manage Hours
          </Header>
          <Link href = {`/${uid}/${orgAddress}/managerHours`}>
            <Button>Take me!</Button>
          </Link>
        </Grid.Column>

        <Grid.Column>
          <Header icon>
            <Icon name='world' />
            Manager Statistics
          </Header>
          <Link href = {`/${uid}/${orgAddress}/myProfileManager`}>
            <Button>Lets go!</Button>
          </Link>
        </Grid.Column>
        </>
       : null }

{ userData.role === 'customer' ?
        <>
        <Grid.Column>
          <Header icon>
            <Icon name='star outline' />
            Rate An Employee
          </Header>
          <Link href = {`/${uid}/${orgAddress}/rating`}>
            <Button>Let's Rate!</Button>
          </Link>
        </Grid.Column>
        
        <Grid.Column>
          <Header icon>
            <Icon name='money' />
            Pay Bill
          </Header>
          <Link href = {`/${uid}/${orgAddress}/tip`}>
            <Button>Let's Pay!</Button>
          </Link>
        </Grid.Column>
        
        </>
       : null }
    { userData.role === 'employee' ?
        <>
        <Grid.Column>
          <Header icon>
            <Icon name='hourglass start' />
            My Hours
          </Header>
          <Link href = {`/${uid}/${orgAddress}/hours`}>
            <Button>Go to hours!</Button>
          </Link>
        </Grid.Column>

        <Grid.Column>
          <Header icon>
            <Icon name='world' />
            Employee Statistics
          </Header>
          <Link href = {`/${uid}/${orgAddress}/myProfile`}>
            <Button>I wanna see!</Button>
          </Link>
        </Grid.Column>
        </>
       : null }
    </Grid.Row>
  )
}

export default UserAction;