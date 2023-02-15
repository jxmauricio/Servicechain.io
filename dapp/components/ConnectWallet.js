import React from 'react'
import { useAppContext } from '@/context/AppContext';
import { Button } from 'semantic-ui-react';

import Web3 from 'web3';
function ConnectWallet(props) {
    let web3;
    const {setCurrWeb3,currWeb3,setUserData} = useAppContext();
    const connectWallet = async()=>{
        try {
            if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
                // We are in the browser and metamask is running.
                window.ethereum.request({ method: "eth_requestAccounts" });
                web3 = new Web3(window.ethereum);
              } else {
                // We are on the server *OR* the user is not running metamask
                const provider = new Web3.providers.HttpProvider(
                  "https://goerli.infura.io/v3/e3096431bf7d415999061c3b795262a3"
                );
                web3 = new Web3(provider);
              }
            setCurrWeb3(web3);
            const accounts = await web3.eth.getAccounts()
            console.log(accounts[0])
            setUserData(prev=>{return{...prev,publicAddress:accounts[0]}})
            props.setSecondIsFinished ? props.setSecondIsFinished(prev=>!prev):null;
            props.setThirdIsFinished(true)
        } catch (error) {
            console.error(error);
        }
        
        }
  return (
    <div><Button onClick={connectWallet}>Connect Wallet</Button></div>
  )
}

export default ConnectWallet;

