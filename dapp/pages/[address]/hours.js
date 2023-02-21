import React,{useState,useEffect} from 'react';
import DatePicker from 'react-datepicker';
import {Form,Table,Message,Input,Button,Container,Icon} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import "react-datepicker/dist/react-datepicker.css";
import { useAppContext } from '@/context/AppContext';
import service from '@/ethereum/service';
import factory from '@/ethereum/factory';
import web3 from '@/ethereum/web3';
function hours(props) {
  //function gets the days of the week and puts it in an array 
  const {address,orgName,currentContract} = props;
  const {currWeb3,userData} = useAppContext();
  const [requests, setRequests] = useState([])
  const [approvedRequests, setApprovedRequests] = useState([])
  const [startDate, setStartDate] = useState(new Date());
  const [hours, setHours] = useState(0);
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);


  useEffect(() => {
      const fetchRequests = async()=>{
      const accounts = await web3.eth.getAccounts();
      const hourRequests = await service(address).methods.getHourLog(accounts[0]).call();

      const fetchApprovedRequests = await service(address).getPastEvents('submitApproval',{filter: {recipient:accounts[0]}, fromBlock:0});
      setApprovedRequests(fetchApprovedRequests);
      console.log(fetchApprovedRequests);
      setRequests(hourRequests);

      
    }
    fetchRequests();
  }, [loading])

  var onSubmit = async()=>{
    setLoading(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await service(address).methods.requestHours(hours).send({from:accounts[0]});
      
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }
  
 
    let renderPendingRequests = requests.map((struct)=>{
      return (
      <Table.Row>
        <Table.Cell>{new Date(struct.date*1000).toLocaleDateString("en-US")}</Table.Cell>
        <Table.Cell>{struct.hour}</Table.Cell>
        <Table.Cell><Icon name='wait'/><label>Pending</label></Table.Cell>
      </Table.Row>
      )
    });

    let renderApprovedRequests = approvedRequests.map((event)=>{
      return (
      <Table.Row>
        <Table.Cell>{new Date(event.returnValues.forDate*1000).toLocaleDateString("en-US")}</Table.Cell>
        <Table.Cell>{event.returnValues.hour}</Table.Cell>
        <Table.Cell><Icon name='check circle' color='green'/><label>Approved</label></Table.Cell>
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
        <Table.HeaderCell>Status</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
    {renderPendingRequests}
    {renderApprovedRequests}
    </Table.Body>
      
    </Table>
    </Container>
  )
}

hours.getInitialProps = async (props)=>{
  const {address} = props.query;
 console.log(await web3.eth.getAccounts());

  // 
  // await currentContract.methods.sendRatings('0x875439656098eBAF5F9d1908441Ab29C4A8Eb96A','0x8d77A1962a6214d7f5FDEd8364eD4260833f06E8',2).send({from:accounts[0]});
  const orgName = await factory.methods.orgNames(address).call();
  return {address,orgName}
}
export default hours;