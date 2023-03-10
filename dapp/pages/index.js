import React from 'react'
import {Container } from 'semantic-ui-react';
import Login from '@/components/Login';

//first page that the user sees 
function index() {
  return (
    //three main things to finsh
    //3. real time market price, how can we reduce calls? 
    <Container>
        <Login/>
    </Container>
   
  )
}

export default index