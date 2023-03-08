import {React,useEffect,useState} from 'react'
import service from '../../../ethereum/service';
import factory from '../../../ethereum/factory'
import web3 from '@/ethereum/web3';
import { Button,Container,Form,Input,Message,Dropdown,Rating } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { useRouter } from 'next/router';
import { options } from '@/helper/conversions';
import { collection,query,where,getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

import axios from 'axios';
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
  const [empFilter, setEmpFilter] = useState('');
  const [empOptions, setEmpOptions] = useState([]);

  useEffect(() => {
    const fetchRequests = async()=>{

    const usersRef = collection(db,'Users');
    const q = query(usersRef,where("orgAddress","==",address),where("role","==","employee"));
    const querySnapshot = await getDocs(q);
    const datas = []
    querySnapshot.forEach((doc,index)=>{
      const data = doc.data();
      datas.push({ key:index,
      text: `${data.first} ${data.last}`,
      value: `${data.publicAddress}`});
       
    });
    setEmpOptions(datas);
    }
    fetchRequests();
  },[loading])
  
  var onSubmit = async()=>{
    try {
      const accounts = await web3.eth.getAccounts();
      await service(address).methods.sendRatings(empFilter,rating).send({from:accounts[0]});
     
    } catch (error) {
      setError(error.message);
    }
  }


  return (
    <Container>
      <h3>For {props.orgName}</h3>
      <h3>Send A Rating!</h3>
      <Dropdown placeholder='Select Waiter' selection options = {empOptions} onChange={(event,data)=>{setEmpFilter(data.value),setError('')}}/>
        <Form onSubmit={onSubmit} error={error ? true : false}>
            <Form.Field>
                <Rating style={{marginTop:'10px'}} icon='star' defaultRating={0} maxRating={5} size='massive' onRate={(event,data)=>setRating(data.rating)}/>
            </Form.Field>
            <Message error header = 'Oops!' content = {error}/>
            <Button primary loading={loading}>Submit Rating!</Button>
        </Form>
    </Container>
  )
}
//This connects the current service contract with the one clicked by our user
rating.getInitialProps = async (props)=>{
    const {address} = props.query;
    // const response = await axios.request(options);
    // const marketPrice = response.data.ethereum.usd;
    const marketPrice = 1600;
    const currentContract = service(address);
    // await currentContract.methods.sendRatings('0x875439656098eBAF5F9d1908441Ab29C4A8Eb96A','0x8d77A1962a6214d7f5FDEd8364eD4260833f06E8',2).send({from:accounts[0]});
    const orgName = await factory.methods.orgNames(address).call();
    return {address,currentContract,orgName,marketPrice}
}
export default rating;