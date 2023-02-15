import { createContext, useContext,useState } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [userData, setUserData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    role:'',
  })
  const [currWeb3,setCurrWeb3] = useState('');
  let sharedState = {userData,setUserData,currWeb3,setCurrWeb3};
  
  return (
    <AppContext.Provider value={sharedState}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}