import React,{useState} from 'react'
import web3 from '@/ethereum/web3'
import { Button,Input,Segment } from 'semantic-ui-react'
import service from '@/ethereum/service'
import { usdToWei } from '@/helper/conversions'
import { useAuth } from '@/context/AuthContext'
function Deposit(props) {
    const {marketPrice} = useAuth();
    const {orgAddress} = props;
    const [amount,setAmount] = useState(0);
    const submitDeposit = async()=>{
        const accounts = await web3.eth.getAccounts();
        await service(orgAddress).methods.deposit().send({from:accounts[0],value:usdToWei(amount,marketPrice)})
    }
  return (
    <Segment>
      <h3>Got More Money?</h3>
        <Input label='USD' labelPosition='right' placeholder='Amount' onChange={(e)=>setAmount(e.target.value)}></Input>
        <Button primary onClick={submitDeposit}>Deposit!</Button>
    </Segment>
  )
}

export default Deposit;