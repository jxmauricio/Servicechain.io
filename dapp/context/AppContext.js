import { createContext, useContext,useState } from 'react';

const AppContext = createContext();
//Function contains context for the whole application, we use this to update data to firebase after a user has signed up
export function AppWrapper({ children }) {
  //state that holds data we need to put in firebase user collection
  const [userData, setUserData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    role:'',
    publicAddress:''
  })
  console.log(userData);
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