import React from 'react'
import {Container } from 'semantic-ui-react';
import Login from '@/components/Login';
import { ThemeContext } from '@/context/AppContext';
import usdToWei from '@/helper/conversions';
//first page that the user sees 
function index() {
  return (
    //TODO, REFACTOR THE SIGNUP AND LOGIN TO THE LOGINUPDATED LOGIC AND THE NEW CONTEXt
    //TAKE OUT THE CONTEXT THAT HOLDS DATA THROUGHOUT THE APP, WE SHOULD PROB BE USING IT ONLY FOR SIGN UP
    //REST OF THE APP SHOULD LOAD IN DATA THROUGH NEXT INITIAL PROPS AND FIREBASE
    <Container>
        <Login/>
    </Container>
   
  )
}

export default index