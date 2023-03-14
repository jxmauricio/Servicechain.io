import {React,useEffect,useState} from 'react'
import service from '../../../ethereum/service';
import factory from '../../../ethereum/factory'
import web3 from '@/ethereum/web3';
import { Button,Container,Form,Input,Message,Dropdown,Rating,Segment } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';
import { useRouter } from 'next/router';
import { collection,query,where,getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

function rating(props) {
  const router = useRouter();
  const address = router.query.address;

  const [rating, setRating] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [empFilter, setEmpFilter] = useState('');
  const [empOptions, setEmpOptions] = useState([]);
 //gets the data on employees that the customer could rate for the given organziaiton 
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
  //submits the rating onto the blockchain
  var onSubmit = async()=>{
    try {
      const accounts = await web3.eth.getAccounts();
      await service(address).methods.sendRatings(empFilter,rating).send({from:accounts[0]});
     
    } catch (error) {
      setError(error.message);
    }
  }


  return (
    <Container textAlign='center'>
      <Segment compact style={{margin:'auto'}}>
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
        </Segment>
    </Container>
  )
}
//This connects the current service contract with the one clicked by our user
rating.getInitialProps = async (props)=>{
    const {address} = props.query;
    const currentContract = service(address);
    const orgName = await factory.methods.orgNames(address).call();
    return {address,currentContract,orgName}
}
export default rating;