import React, { useState } from 'react'
import { Button,Menu } from 'semantic-ui-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/router';
import Link from 'next/link';

function Navbar() {
const {logout,user} = useAuth();
const [role, setRole] = useState("");

const router = useRouter();
  return (
    <Menu>
    <Menu.Item>
    
    {user?.role == 'manager' ? <Link href={`/${uid}/createService`}><Button primary>New Service</Button></Link>   : null}
    </Menu.Item>
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