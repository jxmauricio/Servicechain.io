import React,{useEffect} from 'react'
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
    <div style={{}}>
      <svg width="200" height="200">       
        <image href="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" src="metamask" width="200" height="200"/>    
      </svg>
      <Button onClick={onClick}>Connect Wallet</Button>
      
      </div>
  )
}

export default ConnectWallet;

