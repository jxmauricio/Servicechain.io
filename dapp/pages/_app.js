import '@/styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import React,{ useState } from 'react';
import { AppWrapper } from '@/context/AppContext';
import { AuthContextProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
export default function App({ Component, pageProps }) {
  return (
  //App wrapper holds state of the current user for when we login 
  <AppWrapper>
  <AuthContextProvider>
    <Navbar/>
    <Component {...pageProps} />
  </AuthContextProvider>
  </AppWrapper>
  
  )
}
