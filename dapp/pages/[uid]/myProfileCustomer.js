import React,{useState,useEffect} from 'react'
import service from '@/ethereum/service';
import web3 from '@/ethereum/web3';
import { db } from '@/config/firebase';
import { where,collection,query,getDoc,doc,getDocs } from 'firebase/firestore';
import { Statistic,Container,Dropdown,Grid,Table,Icon,Segment,Rating, Message } from 'semantic-ui-react';
import { weiToUsd } from '@/helper/conversions';
import { options } from '@/helper/conversions';
import axios from 'axios';
import factory from '@/ethereum/factory';
import average from '@/helper/average';
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
  console.log(selectedOrg)
  useEffect(()=>{
    const getData = async()=>{
      if (selectedOrg) {
        const fetchPastRatings = await service(selectedOrg).getPastEvents('submitRating',{filter: {sender:userData.publicAddress}, fromBlock:0});
        console.log(fetchPastRatings)
        const fetchPastTips = await service(selectedOrg).getPastEvents('submitTip',{filter: {sender:userData.publicAddress}, fromBlock:0});
        const fetchDeposits = await service(selectedOrg).getPastEvents('Deposit',{filter: {sender:userData.publicAddress}, fromBlock:0});
        setNumVisited(fetchDeposits.length);
        var empAddrs = fetchPastRatings.map((data)=>{
          return data.returnValues.recipient
        })
        const ref = collection(db,"Users")
        if (empAddrs.length!=0){
            var q = query(ref,where("publicAddress","in",empAddrs),where("role","==","employee"));
            var querySnapshot = await getDocs(q);
            const pastRatingsHistory = []
            var i = 0;
            querySnapshot.forEach((doc)=>{
              console.log(doc.data())
              const rating = fetchPastRatings[i].returnValues.rating
              const data = doc.data()
              pastRatingsHistory.push(
                {first:data.first,last:data.last,value:rating}
              )
              i = i +1;
            });
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
        q = query(ref,where("publicAddress","in",empAddrs),where("role","==","employee"));
        querySnapshot = await getDocs(q);
        const pastTipsHistory = []
        let totalTips = 0
        querySnapshot.forEach((doc)=>{
          console.log(doc.data())
          const tip = fetchPastTips[i].returnValues.tipAmount
          const data = doc.data()
          pastTipsHistory.push(
            {first:data.first,last:data.last,value:weiToUsd(tip,1600)}
          )
          totalTips = totalTips + weiToUsd(tip,1600);
          i = i +1;
        });
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
                    <Table.HeaderCell>You Rated</Table.HeaderCell>
                    <Table.HeaderCell>Your Rating</Table.HeaderCell>
                </Table.Row>
                {pastRatings.map((data)=>(
                        <Table.Row>
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
                    <Table.HeaderCell>Customer</Table.HeaderCell>
                    <Table.HeaderCell>Your Tips</Table.HeaderCell>
                </Table.Row>
                  {pastTips.map((data)=>(
                        <Table.Row>
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
                <Statistic.Value>{totalTips}</Statistic.Value>
                <Statistic.Label>Amount Spent On Tips</Statistic.Label>
                <Statistic.Value>{numTips}</Statistic.Value>
                <Statistic.Label>Total Tips</Statistic.Label>
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