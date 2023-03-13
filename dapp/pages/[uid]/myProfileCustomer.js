import React,{useState,useEffect} from 'react'
import service from '@/ethereum/service';
import web3 from '@/ethereum/web3';
import { db } from '@/config/firebase';
import { where,collection,query,getDoc,doc,getDocs } from 'firebase/firestore';
import { Statistic,Container,Dropdown,Grid,Table,Icon,Segment,Rating, Message } from 'semantic-ui-react';
import { weiToUsd } from '@/helper/conversions';
import { useAuth } from '@/context/AuthContext';
import factory from '@/ethereum/factory';
import average from '@/helper/average';
import toDate from '@/helper/toDate';
function myProfileCustomer(props) {
    //Feed of employees that the customer has rated
    //FEed of employees that the customer has tipped 
    //Amount of money they have sent per organization 
  const [selectedOrg,setSelectedOrg] = useState('');
  const [pastRatings, setPastRatings] = useState([]);
  const [pastTips, setPastTips] = useState([]);
  const [numRatings,setNumRatings] = useState(0);
  const [numVisited,setNumVisited] = useState(0);
  const [numTips,setNumTips] = useState(0);
  const [totalTips,setTotalTips] = useState(0);
  const {items,userData} = props;
  const {marketPrice} = useAuth();
  console.log(selectedOrg)
  useEffect(()=>{
    const getData = async()=>{
      if (selectedOrg) {
        const fetchPastRatings = await service(selectedOrg).getPastEvents('submitRating',{filter: {sender:userData.publicAddress}, fromBlock:0});
        console.log(fetchPastRatings)
        const fetchPastTips = await service(selectedOrg).getPastEvents('submitTip',{filter: {sender:userData.publicAddress}, fromBlock:0});
        console.log(fetchPastTips)
        const fetchDeposits = await service(selectedOrg).getPastEvents('Deposit',{filter: {sender:userData.publicAddress}, fromBlock:0});
        setNumVisited(fetchDeposits.length);
        var empAddrs = fetchPastRatings.map((data)=>{
          return data.returnValues.recipient
        })
        const ref = collection(db,"Users")
        var i = 0;
        if (empAddrs.length!=0){
          const pastRatingsHistory = []
            for (const empAddr of empAddrs){
              var q = query(ref,where("publicAddress","==",empAddr),where("role","==","employee"));
              var querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc)=>{
                const rating = fetchPastRatings[i].returnValues.rating
                const date = toDate(fetchPastRatings[i].returnValues.date)
                const data = doc.data()
                pastRatingsHistory.push(
                  {first:data.first,last:data.last,value:rating,date:date}
                )
              });
              console.log(i)
              i++;
            }
           
            
            setNumRatings(i)
            setPastRatings(pastRatingsHistory);
      } else {
            setNumRatings(0)
            setPastRatings([]);
      } 

      
        //get the past tips
        empAddrs = fetchPastTips.map((data)=>{
          return data.returnValues.recipient
        })
        console.log(empAddrs)
        i = 0;
        if (empAddrs.length!=0) {
          const pastTipsHistory = []
          let totalTips = 0
          for(const empAddr of empAddrs){
            q = query(ref,where("publicAddress","==",empAddr),where("role","==","employee"));
            querySnapshot = await getDocs(q);
            const tip = fetchPastTips[i].returnValues.tipAmount;
            const date = toDate(fetchPastTips[i].returnValues.date)
            //should only be one
            querySnapshot.forEach((doc)=>{
              const data= doc.data()
              pastTipsHistory.push(
                {first:data.first,last:data.last,value:weiToUsd(tip,marketPrice),date:date}
              )
            });
              totalTips = totalTips + weiToUsd(tip,marketPrice)
              i++;
          }
          setTotalTips(totalTips);
          setNumTips(i);
          setPastTips(pastTipsHistory);
        } else {
          setTotalTips(0);
          setNumTips(0);
          setPastTips([]);
        }  
      }  
    }
  getData();
 
  },[selectedOrg])
  return (
    <Container>
      <Dropdown placeholder ='Organization' search selection options={items} onChange ={(e,d)=>{setSelectedOrg(d.value)}}/>
      {!selectedOrg ? <Message header = 'Uh oh!' content='Please pick a business you visited'/> : 
      <Container>
      <Segment>
        <h3>You have purchased from here {numVisited} times</h3>
      </Segment>
      <Grid celled>
        <Grid.Row>
            <Grid.Column width = {11}>
                <Container>  
                <Table basic='very' celled collapsing>
                <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>You Rated</Table.HeaderCell>
                    <Table.HeaderCell>Your Rating</Table.HeaderCell>
                </Table.Row>
                {pastRatings.map((data)=>(
                        <Table.Row>
                          <Table.Cell>
                            {data.date}
                        </Table.Cell>
                        <Table.Cell>
                            {data.first} {data.last}
                        </Table.Cell>
                        <Table.Cell>
                        {<Rating icon='star' defaultRating={parseInt(data.value)} maxRating = {5}disabled/>}
                        </Table.Cell>
                    </Table.Row>
                ))}
        
                </Table.Header>
                </Table>
                </Container>
            </Grid.Column>
            <Grid.Column width ={5}>
                <Statistic>
                    <Statistic.Value><Icon name='star' color='yellow' size='small' />{average(pastRatings)}</Statistic.Value>
                    <Statistic.Label>Avg. Ratings Sent</Statistic.Label>
                    <Statistic.Value>{numRatings}</Statistic.Value>
                    <Statistic.Label># Ratings Sent</Statistic.Label>
                </Statistic>
                
            </Grid.Column>
        </Grid.Row>
        <Grid.Row>
            <Grid.Column width = {11}>
            <Container>  
                <Table basic='very' celled collapsing>
                <Table.Header>
                <Table.Row>
                <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Employee</Table.HeaderCell>
                    <Table.HeaderCell>Your Tips</Table.HeaderCell>
                </Table.Row>
                  {pastTips.map((data)=>(
                        <Table.Row>
                          <Table.Cell>
                            {data.date}
                        </Table.Cell>
                        <Table.Cell>
                            {data.first} {data.last}
                        </Table.Cell>
                        <Table.Cell>
                            $ {data.value}
                        </Table.Cell>
                    </Table.Row>
                    ))}
                </Table.Header>
                </Table>
                </Container>
            </Grid.Column>
            <Grid.Column width = {5}>
            <Statistic>
                <Statistic.Value>${totalTips}</Statistic.Value>
                <Statistic.Label>Amount Spent On Tips</Statistic.Label>
                <Statistic.Value>{numTips}</Statistic.Value>
                <Statistic.Label># Tips Given</Statistic.Label>
            </Statistic>
            </Grid.Column>
        </Grid.Row>
    </Grid>
    </Container> }
    </Container>    
  )
}

myProfileCustomer.getInitialProps = async (props)=>{
// const response = await axios.request(options);
// const marketPrice = response.data.ethereum.usd
// const marketPrice = 1600;
const {uid} = props.query;
const usersRef= doc(db,"Users",uid);
const snapShot = await getDoc(usersRef);
const userData = snapShot.data()


const visitedAddrs = userData.visitedOrgs;
    const orgNames = []
    for (let i =0;i<visitedAddrs.length;i++){
      orgNames.push(await factory.methods.orgNames(visitedAddrs[i]).call());
    }
    const items = visitedAddrs.map((addr,index)=>{
        return {key: index,value:addr,text:orgNames[index]}
    })


return {items,userData}
}
export default myProfileCustomer;