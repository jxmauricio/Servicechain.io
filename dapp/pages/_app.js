import '@/styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import React,{ useState } from 'react';

import { AuthContextProvider } from '@/context/AuthContext';

import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
export default function App({ Component, pageProps }) {
  const {userData} = useAuth();
  return (
  //App wrapper holds state of the current user for when we login 

  <AuthContextProvider>
   <Navbar/>
    <Component {...pageProps} />
  </AuthContextProvider>
  )
}
