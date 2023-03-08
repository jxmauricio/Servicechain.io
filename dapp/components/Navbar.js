import React, { useState } from 'react'
import { Button,Menu,Dropdown } from 'semantic-ui-react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/router';
import Link from 'next/link';
import logo from '@/assets/logo.svg'
function Navbar() {
const {logout,user,userData} = useAuth();
const [role, setRole] = useState("");
const uid = user?.uid
const address = userData?.orgAddress
const router = useRouter();
const handleStatistics = ()=>{
  if (userData.role ==='manager') {
    router.push(`/${uid}/${address}/myProfileManager`);
  } else if(userData.role ==='employee') {
    router.push(`/${uid}/${address}/myProfile`);
  } else {
    router.push(`/${uid}/myProfileCustomer`);
  }
 
}
  return (
    <Menu>
      <Menu.Item>
        <Link href= {`/${uid}/home`}>
        <svg fill="none" height="50" width="50" xmlns="http://www.w3.org/2000/svg" viewBox="11 9 30 33.057">
          <path d="M41 16.212l-15 7.435v18.41l15-7.434z" fill="#2362ad"/><path d="M11 16.212l15 7.435v18.41l-15-7.434z" fill="#4776ba"/>
          <path d="M11 16.212L26 9l15 7.212-15 7.442z" fill="#83bbe6"/>
        </svg>
        </Link>
      </Menu.Item>
    {user ?
    <Menu.Item position='right'> 
      <Dropdown direction='left' icon='users'> 
        <Dropdown.Menu>
          <Dropdown.Item text ='Logout' onClick={()=>{router.push('/');logout();}}/>
            {/* <Button onClick={()=>{router.push('/');logout();}} primary>Logout</Button> 
          <Dropdown.Item/> */}
          <Dropdown.Item text ='My Statistics' onClick={handleStatistics}/>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
    : null}
  </Menu>
  )
}


export default Navbar