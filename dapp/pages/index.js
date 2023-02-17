import React from 'react'
import {Container } from 'semantic-ui-react';
import Login from '@/components/Login';
import { ThemeContext } from '@/context/AppContext';
//first page that the user sees 
function index() {
  return (

    <Container>
        <Login/>
    </Container>
   
  )
}

export default index