
import React,{useEffect} from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Search,
  Segment,
  Container,
  Message
} from 'semantic-ui-react'
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
//this is the last component that is rendered after the signup flow
function UserChoice(props) {
  const {setUserInfo,userInfo,setFourthIsFinished,setThirdIsFinished,setFinished} = props
  const {signUp,setUser} = useAuth();
  //we use the public address of the users metamask account as a unique identifier in firestore
  const handleClick  = async(e)=>{
      console.log('clicked')
      setUserInfo(prev => {return {...prev,role:e.target.value}});
      setFinished(true);
  }

  return (
    
    <Container textAlign='center'>
       <h1>What type of account is this?</h1>
      <Segment placeholder>
        <Grid columns={3} stackable textAlign='center'>
          
          <Grid.Row verticalAlign='middle'>
            <Grid.Column>
              <Header icon>
                <Icon name='chess king' color='blue' />
              </Header>
              <Button color='blue' value='manager' onClick={e=>handleClick(e)}>Manager</Button>
            </Grid.Column>
            
         
            <Grid.Column>
              <Header icon>
                <Icon name='chess knight' color='green' />
              </Header>

              <Button color='green' value='employee' onClick={e=>handleClick(e)}>Employee</Button>
            </Grid.Column>
            
            <Grid.Column>
              <Header icon>
                <Icon name='chess pawn' color='red' />
              </Header>
              <Button color='red' value='customer' onClick={e=>handleClick(e)}>Customer</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
     
      
      
      
    </Container>
  )
}

export default UserChoice;