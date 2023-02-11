import {React,useState} from 'react'
import service from '../../ethereum/service';
import factory from '../../ethereum/factory'
import web3 from '@/ethereum/web3';
import { Button,Form,Input,Message } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { useRouter } from 'next/router';
function rating(props) {
  // console.log(props.currentContract.methods.sendRatings());
  const router = useRouter();
  const address = router.query.address;
  console.log(address)
  const [waiterAddress, setWaiterAddress] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [rating, setRating] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(props.currentContract);
  const currentContract = props.currentContract;
  console.log(props.currentContract)
  var onSubmit = async()=>{
    try {
      const accounts = await web3.eth.getAccounts();
      await service(address).methods.sendRatings(waiterAddress,customerAddress,rating).send({from:accounts[0]});
     
    } catch (error) {
      setError(error.message);
    }
  }


  return (
    <div>
      <h3>For {props.orgName}</h3>
      <h3>Create a Campaign</h3>
        <Form onSubmit={onSubmit} error={error ? true : false}>
            <Form.Field>
                <label>Waiter Address</label>
                <Input
                 value ={waiterAddress}
                 onChange={event=>setWaiterAddress(event.target.value)}
                />
                <label>Your Address</label>
                <Input
                 value ={customerAddress}
                 onChange={event=>setCustomerAddress(event.target.value)}
                />
                <label>What is your rating?</label>
                <Input
                 label = 'Scale 1-5'
                 labelPosition='right'
                 value ={rating}
                 onChange={event=>setRating(event.target.value)}
                />
            </Form.Field>
            <Message error header = 'Oops!' content = {error}/>
            <Button primary loading={loading}>Submit Rating!</Button>
        </Form>
    </div>
  )
}
//This connects the current service contract with the one clicked by our user
rating.getInitialProps = async (props)=>{
    const {address} = props.query;
    // console.log(address)
    const currentContract = service(address);
    // await currentContract.methods.sendRatings('0x875439656098eBAF5F9d1908441Ab29C4A8Eb96A','0x8d77A1962a6214d7f5FDEd8364eD4260833f06E8',2).send({from:accounts[0]});
    const orgName = await factory.methods.orgNames(address).call();
    return {address,currentContract,orgName}
}
export default rating;