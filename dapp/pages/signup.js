import React, { cloneElement, useState } from 'react'
import Signup from '@/components/Signup'
import { Container,Button } from 'semantic-ui-react'
import Web3 from "web3";
import UserChoice from '@/components/UserChoice';

function signup() {
  

  return (
    <Container>
        <Signup/>
        {/* <UserChoice/>  */}
    </Container>
  )
}

export default signup