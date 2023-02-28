import React,{useEffect} from 'react'
import { useAppContext } from '@/context/AppContext';
import { Button } from 'semantic-ui-react';
import connectWallet from '@/helper/connectWallet';
function ConnectWallet(props) {
  const {setUserInfo,userInfo,setSecondIsFinished,setThirdIsFinished} = props;
  
  useEffect(() => {
    const changePage = ()=>{
        if (userInfo.publicAddress){
          console.log("USER INFO CHANGED"+`${userInfo.publicAddress}`);
          setSecondIsFinished(false);
          setThirdIsFinished(true)
        }
    }
    changePage();
  }, [userInfo])
   
  const onClick = async()=>{
      try {
          const web3 = await connectWallet();
          const accounts = await web3.eth.getAccounts();
          setUserInfo(prev=>{return{...prev,publicAddress:accounts[0]}});
      } catch (error) {
          console.error(error);
      }   
    }
  
  return (
    <div><Button onClick={onClick}>Connect Wallet</Button></div>
  )
}

export default ConnectWallet;

