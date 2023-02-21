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

 
    let renderPendingRequests = requests.map((struct)=>{
      return (
      <Table.Row>
        <Table.Cell>{new Date(struct.date*1000).toLocaleDateString("en-US")}</Table.Cell>
        <Table.Cell>{struct.hour}</Table.Cell>
        <Table.Cell><Button color='green'>Approve</Button></Table.Cell>
        <Table.Cell><Button color ='red'>Deny</Button></Table.Cell>
      </Table.Row>
      )
    });




  return (
    <Container style={{'margin-top':'20px'}}>
      <h3>Pending Hour Request For {props.orgName}</h3>

      <Table>
      <Table.Header>
      <Table.Row>
        <Table.HeaderCell>From</Table.HeaderCell>
        <Table.HeaderCell>Hours Requested</Table.HeaderCell>
        <Table.HeaderCell>Approve</Table.HeaderCell>
        <Table.HeaderCell>Deny</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
    {renderPendingRequests}
    </Table.Body>
      
    </Table>
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