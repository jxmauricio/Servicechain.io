import '@/styles/globals.css'
import 'semantic-ui-css/semantic.min.css'
import React,{ useState } from 'react';
import { AppWrapper } from '@/context/AppContext';
export default function App({ Component, pageProps }) {
  return (
  //App wrapper holds state of the current user for when we login 
  <AppWrapper>
    <Component {...pageProps} />
  </AppWrapper>
  
  )
}
