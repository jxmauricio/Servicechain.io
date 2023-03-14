import React,{useState,useEffect} from 'react';
import DatePicker from 'react-datepicker';
import {Form,Table,Message,Input,Button,Container,Icon} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import "react-datepicker/dist/react-datepicker.css";

import service from '@/ethereum/service';
import factory from '@/ethereum/factory';
import { db } from '@/config/firebase';
import { doc,getDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import {weiToUsd } from '@/helper/conversions';

function hours(props) {

  const {address,userData} = props;
  const [requests, setRequests] = useState([])
  const [approvedRequests, setApprovedRequests] = useState([])
  const [startDate, setStartDate] = useState(new Date());
  const [hours, setHours] = useState(0);
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);
  const [deniedRequests, setDeniedRequests] = useState([])
  const {marketPrice} = useAuth();
//fetches the events logged on blockcahing for the approved and denied requests of the current logged in employee
  useEffect(() => {
      const fetchRequests = async()=>{
      const hourRequests = await service(address).methods.getHourLog(userData.publicAddress).call();
      const fetchApprovedRequests = await service(address).getPastEvents('submitApproval',{filter: {recipient:userData.publicAddress,isApproved:true}, fromBlock:0});
      const fetchDeniedRequests = await service(address).getPastEvents('submitApproval',{filter: {recipient:userData.publicAddress,isApproved:[false]}, fromBlock:0});
      
      setDeniedRequests(fetchDeniedRequests)
      setApprovedRequests(fetchApprovedRequests);
      setRequests(hourRequests);

      
    }
    fetchRequests();
  }, [loading])

  var onSubmit = async()=>{
    setLoading(true);
    try {
      // const accounts = await web3.eth.getAccounts();
      await service(address).methods.requestHours(hours).send({from:userData.publicAddress});
      
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }
  
    //renders the requests for the employee
    let renderPendingRequests = requests.map((struct)=>{
      return (
      <Table.Row>
        <Table.Cell>{new Date(struct.date*1000).toLocaleDateString("en-US")}</Table.Cell>
        <Table.Cell>{struct.hour}</Table.Cell>
        <Table.Cell>${weiToUsd(struct.estimatedPayement,marketPrice)}</Table.Cell>
        <Table.Cell><Icon name='wait'/><label>Pending</label></Table.Cell>
      </Table.Row>
      )
    });
    //renders the approved requests for the current employee
    let renderApprovedRequests = approvedRequests.map((event)=>{
      return (
      <Table.Row>
        <Table.Cell>{new Date(event.returnValues.forDate*1000).toLocaleDateString("en-US")}</Table.Cell>
        <Table.Cell>{event.returnValues.hour}</Table.Cell>
        <Table.Cell>${weiToUsd(event.returnValues.amountPaid,marketPrice) }</Table.Cell>
        <Table.Cell><Icon name='check circle' color='green'/><label>Approved</label></Table.Cell>
      </Table.Row>
      )
    });
    //renders the denied requests of the current employee 
    let renderDeniedRequests = deniedRequests.map((event)=>{
      return (
      <Table.Row>
        <Table.Cell>{new Date(event.returnValues.forDate*1000).toLocaleDateString("en-US")}</Table.Cell>
        <Table.Cell>{event.returnValues.hour}</Table.Cell>
        <Table.Cell>${weiToUsd(event.returnValues.amountPaid,marketPrice) }</Table.Cell>
        <Table.Cell><Icon name='dont' color='red'/><label>Denied</label></Table.Cell>
      </Table.Row>
      )
    });
    
  return (
    <Container style={{'margin-top':'20px'}}>
      <h3>Hour Request Form For {props.orgName}</h3>

        <Form onSubmit={onSubmit} error={error ? true : false}>
            <Form.Field>
                <label>Date Worked</label>
                <DatePicker selected ={startDate} onChange={(date)=>{setStartDate(date)}}/>
                <label>Hours</label>
                <Input
                 value ={hours}
                 onChange={event=>setHours(event.target.value)}
                />
            </Form.Field>
            <Message error header = 'Oops!' content = {error}/>
            <Button primary loading={loading}>Send Request!</Button>
        </Form>

      <Table>
      <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Date</Table.HeaderCell>
        <Table.HeaderCell>Hours Requested</Table.HeaderCell>
        <Table.HeaderCell>Estimated Payement</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
    {renderPendingRequests}
    {renderApprovedRequests}
    {renderDeniedRequests}
    </Table.Body>
      
    </Table>
    </Container>
  )
}

hours.getInitialProps = async (props)=>{
  const {address,uid} = props.query;
  const ref = doc(db,'Users',uid)
  const snapShot = await getDoc(ref);
  const userData = snapShot.data()


  const orgName = await factory.methods.orgNames(address).call();


  return {address,orgName,userData}
}
export default hours;