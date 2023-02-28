import React from 'react'
import { Button,Menu } from 'semantic-ui-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/router';
function Navbar() {
const {logout,user} = useAuth();
const router = useRouter();
  return (
    <Menu>
    <Menu.Item position='right'>
    {user ? <Button onClick={()=>{
    router.push('/');
    logout();
    }} 
    primary>Logout</Button> : null}
    </Menu.Item>
  </Menu>
  )
}

export default Navbar