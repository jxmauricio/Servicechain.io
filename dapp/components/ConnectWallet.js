import React,{useEffect} from 'react'
import { useAppContext } from '@/context/AppContext';
import { Button } from 'semantic-ui-react';
import connectWallet from '@/helper/connectWallet';
function ConnectWallet(props) {
  const {setCurrWeb3,setUserData,userData} = useAppContext();
  useEffect(() => {
    const changePage = ()=>{
        if (userData.publicAddress){
          props.setSecondIsFinished ? props.setSecondIsFinished(prev=>!prev):null;
          props.setThirdIsFinished(true)
        }
    }
    changePage();
  }, [userData])
  
  const onClick = async()=>{
      try {
          const web3 = await connectWallet();
          setCurrWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setUserData(prev=>{return{...prev,publicAddress:accounts[0]}})    ;
      } catch (error) {
          console.error(error);
      }   
    }
  
  return (
    <div><Button onClick={onClick}>Connect Wallet</Button></div>
  )
}

export default ConnectWallet;

