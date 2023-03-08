import React,{useState,useEffect} from 'react';
import DatePicker from 'react-datepicker';
import {Form,Table,Message,Input,Button,Container,Icon,Dropdown} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import "react-datepicker/dist/react-datepicker.css";
import service from '@/ethereum/service';
import factory from '@/ethereum/factory';
import web3 from '@/ethereum/web3';
import { collection,getDocs,query,where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { options,weiToUsd } from '@/helper/conversions';
import axios from 'axios';
function hours(props) {
  //function gets the days of the week and puts it in an array 
  const {address,orgName,currentContract} = props;
  const [requests, setRequests] = useState([])
  const [approvedRequests, setApprovedRequests] = useState([])
  const [startDate, setStartDate] = useState(new Date());
  const [hours, setHours] = useState(0);
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);
  const [empOptions, setEmpOptions] = useState([]);
  const [empFilter, setEmpFilter] = useState('');
  const [marketPrice, setMarketPrice] = useState('');

  useEffect(() => {
      const fetchRequests = async()=>{
      // const accounts = await web3.eth.getAccounts();
      const response = await axios.request(options);
      setMarketPrice(response.data.ethereum.usd);

      const usersRef = collection(db,'Users');
      const q = query(usersRef,where("orgAddress","==",address),where("role","==","employee"));
      const querySnapshot = await getDocs(q);
      const datas = []
      querySnapshot.forEach((doc)=>{
        const data = doc.data();
        datas.push({ key:`${data.first} ${data.last}`,
        text: `${data.first} ${data.last}`,
        value: `${data.publicAddress}`});
         
      });
      setEmpOptions(datas);
      try {
        const hourRequests = await service(address).methods.getHourLog(empFilter).call();
        // const fetchApprovedRequests = await service(address).getPastEvents('submitApproval',{filter: {recipient:empFilter}, fromBlock:0});
        // setApprovedRequests(fetchApprovedRequests);
        setRequests(hourRequests);
      } catch (error) {
        setError(error)
      }
      
      

      
    }
    fetchRequests();
  }, [empFilter])

    const onApprove = async(index)=>{
    console.log(index);
    const accounts = await web3.eth.getAccounts();
    await service(address).methods.confirmHours(empFilter,index).send({from:accounts[0]});
  }

    const onDeny = async(index)=>{
    console.log(index);
    const accounts = await web3.eth.getAccounts();
    await service(address).methods.denyHours(empFilter,index).send({from:accounts[0]});
  }

    
    let renderPendingRequests = requests.map((struct,index)=>{
      return (
      <Table.Row>
        <Table.Cell>{new Date(struct.date*1000).toLocaleDateString("en-US")}</Table.Cell>
        <Table.Cell>{struct.hour}</Table.Cell>
        <Table.Cell>${weiToUsd(struct.estimatedPayement,marketPrice)}</Table.Cell>
        <Table.Cell><Button value = {index} onClick={(e)=>onApprove(e.target.value)} color='green'>Approve</Button></Table.Cell>
        <Table.Cell><Button value = {index} onClick={(e)=>onDeny(e.target.value)} color ='red'>Deny</Button></Table.Cell>
      </Table.Row>
      )
    });



    console.log(empOptions.length);
  return (
    <Container style={{'margin-top':'20px'}} textAlign='center'>
      <h3>Pending Hour Request For {props.orgName}</h3>
     
      <Dropdown placeholder='Select Employee' selection options = {empOptions} onChange={(event,data)=>{setEmpFilter(data.value),setError('')}}/>
      {
      empOptions.length==0 ? <Message header='No Employees' content='Comeback when you have hired!'/> :
      error ? <Message header = "Please Pick An Employee"/>:
      <Table>
      <Table.Header>
      <Table.Row>
        <Table.HeaderCell>From</Table.HeaderCell>
        <Table.HeaderCell>Hours Requested</Table.HeaderCell>
        <Table.HeaderCell>Estimated Payment</Table.HeaderCell>
        <Table.HeaderCell>Approve</Table.HeaderCell>
        <Table.HeaderCell>Deny</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
    {renderPendingRequests}
    </Table.Body>
      
    </Table>
    }
    </Container>
  )
}

hours.getInitialProps = async (props)=>{
  const {address} = props.query;
  // await currentContract.methods.sendRatings('0x875439656098eBAF5F9d1908441Ab29C4A8Eb96A','0x8d77A1962a6214d7f5FDEd8364eD4260833f06E8',2).send({from:accounts[0]});
  const orgName = await factory.methods.orgNames(address).call();
  return {address,orgName}
}
export default hours;