import React,{useEffect, useState} from 'react'
import { Form,Button,Container,Message,Segment,Grid,Divider } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
function Login() {
    const {user,login,logout,signup} = useAuth();
    const [currEmail, setCurrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState('');
    const router = useRouter();
    
    useEffect(() => {
        
      const enterHub = async()=>{
        if (user){
            router.push(`${user.uid}/home`);
        } else {
            null
        }
      }
    enterHub()
    } , [user])
    
    const handleLogin = async()=>{
        setLoading(true);
        try{
            console.log(currEmail,password)
            await login(currEmail, password);
          
        } catch (error){
            setError(error.message);

        }
        setLoading(false);
      }
  return (
        <Container style={{  padding: '70px 0',
            textAlign: 'center'}}>
        <h1>Welcome to ServiceChain.io!</h1>
        <Segment placeholder >
        <Grid columns={2} relaxed='very' stackable>
            <Grid.Column>
                <Form onSubmit={handleLogin} style={{top:'10px'}} error ={error ? true : false}>
                <Form.Input icon='user' iconPosition='left'  label='Email' placeholder='Email' onChange={e=>setCurrEmail(e.target.value)}/>
                <Form.Input icon='lock' iconPosition='left' label='Password' placeholder='Password' type='password' onChange={e=>setPassword(e.target.value)}/>
                <Button primary loading={loading}>Login!</Button>
                <Message error header='Oops!' content = {error}/>
                </Form>
            </Grid.Column>

            <Grid.Column verticalAlign='middle'>
                <Link href='/signup'><Button content='Sign up' icon='signup' size='big' /></Link>
                    
            </Grid.Column>
        </Grid>

        <Divider vertical>Or</Divider>
        </Segment>
        </Container>
)
   
}

export default Login;