import React from 'react'
import {Container } from 'semantic-ui-react';
import Login from '@/components/Login';

//first page that the user sees 
function index() {
  return (
    //Refactor UI for customer rating 
    //Add a confirm button when choosing an organization 
    //
    <Container>
        <Login/>
    </Container>
   
  )
}

export default index