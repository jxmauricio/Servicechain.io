import React from 'react'
import service from '@/ethereum/service';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/config/firebase';
import { doc,getDoc,collection,query, where,getDocs } from 'firebase/firestore';
import { Table,Rating,Container,Grid,Statistic,Icon,Message,Segment,Label } from 'semantic-ui-react';
import { weiToUsd } from '@/helper/conversions';
import average from '@/helper/average';
import factory from '@/ethereum/factory';
import toDate from '@/helper/toDate';
function myProfile(props) {
const {user} = useAuth();
const {fetchRatings,ratingCustomerAddrs,pastRatingsHistory,pastTipsHistory,marketPrice,hourlyRate,orgname} = props
console.log(pastTipsHistory)
  return (
    <Container textAlign='center'> 
    {pastRatingsHistory.length ==0 && pastTipsHistory ==0 ? <Message header='Uh Oh!' content="Looks like you don't have any ratings or tips yet. Come back later when you do!"/>: 
    <Container>
    <Segment>
    <h1>Employee Statistics at {orgname}</h1>
    <label>Pay at <Label tag>${hourlyRate}</Label></label>
    </Segment>
    <Grid celled>
        <Grid.Row>
        { pastRatingsHistory.length==0 ? <Message warning style={{width:'100%'}} header ='Uh Oh' content='No Rating Data just yet!'/> : 
           <>
           <Grid.Column width = {11}>
                <Container>  
                <Table basic='very' celled collapsing>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Customer</Table.HeaderCell>
                    <Table.HeaderCell>Your Rating</Table.HeaderCell>
                </Table.Row>
                {pastRatingsHistory.map((data)=>(
                        <Table.Row>
                        <Table.Cell>
                            {toDate(data.date)}
                        </Table.Cell>
                        <Table.Cell>
                            {data.first} {data.last}
                        </Table.Cell>
                        <Table.Cell>
                            <Rating icon='star' defaultRating={data.value} maxRating = {5}disabled/>
                        </Table.Cell>
                    </Table.Row>
                ))}
                </Table.Header>
                </Table>
                </Container>
            </Grid.Column>
            <Grid.Column width ={5}>
                <Statistic>
                    <Statistic.Value><Icon name='star' color='yellow' size='small' />{average(pastRatingsHistory)}</Statistic.Value>
                    <Statistic.Label>Average Rating</Statistic.Label>
                </Statistic>
                
            </Grid.Column>
            </> }
        </Grid.Row>
        <Grid.Row>
        {pastTipsHistory.length==0 ? <Message warning style={{width:'100%'}} header ='Uh Oh' content='No Tip Data just yet!'/> : 
            <>
            <Grid.Column width = {11}>
            <Container>  
                <Table basic='very' celled collapsing>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Customer</Table.HeaderCell>
                    <Table.HeaderCell>Your Tips</Table.HeaderCell>
                </Table.Row>
            {pastTipsHistory.map((data)=>(
                        <Table.Row>
                         <Table.Cell>
                            {toDate(data.date)}
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
                <Statistic.Value>${average(pastTipsHistory)}</Statistic.Value>
                <Statistic.Label>Average Tips</Statistic.Label>
            </Statistic>
            </Grid.Column>
            </> }
        </Grid.Row>
    </Grid>
    </Container>
}
</Container>
  )
}


myProfile.getInitialProps = async (props) => {
    //replace this later
  
    let marketPrice = await getDoc(doc(db,'MarketPrice','eth'));
    marketPrice = marketPrice.data().usd;
    const {address,uid} = props.query;
    const usersRef= doc(db,"Users",uid);
    const snapShot = await getDoc(usersRef);
    const userData = snapShot.data()
    console.log(userData)
    const fetchRatings = await service(address).getPastEvents('submitRating',{filter: {recipient:userData.publicAddress}, fromBlock:0});
    const fetchTips = await service(address).getPastEvents('submitTip',{filter: {recipient:userData.publicAddress}, fromBlock:0});
    //Used for mapping names 
    const pastRatingsHistory = []
    const pastTipsHistory = []
    const ratingCustomerAddrs = fetchRatings.map(data=>{
        return data.returnValues.sender;
    })
    const tipCustomerAddrs = fetchTips.map(data=>{
        return data.returnValues.sender;
    })
    const ref = collection(db,"Users")
    if (ratingCustomerAddrs.length!=0) {
        let i = 0;
        for (const cusAddr of ratingCustomerAddrs){
            const q = query(ref,where("publicAddress","==",cusAddr),where("role","==","customer"));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc)=>{
              const rating = fetchRatings[i].returnValues.rating
              const date = fetchRatings[i].returnValues.date
              const data = doc.data()
              pastRatingsHistory.push(
                {first:data.first,last:data.last,value:rating,date:date}
              )
            });
            i++;
        }
        
    }
    if (tipCustomerAddrs.length!=0){
        let i = 0;
        for(const cusAddr of tipCustomerAddrs){
            const q = query(ref,where("publicAddress","==",cusAddr),where("role","==","customer"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc)=>{
            const tips = weiToUsd(parseInt(fetchTips[i].returnValues.tipAmount),marketPrice);
            const date = fetchTips[i].returnValues.date;
            console.log(date)
            const data = doc.data();
            pastTipsHistory.push(
                {first:data.first,last:data.last,value:tips,date:date}
            )
            });
        i++;
        }
    }  
       
    
   
    const orgname = await factory.methods.orgNames(userData.orgAddress).call();
    let hourlyRate = await service(userData.orgAddress).methods.hourlyRate().call();
    hourlyRate = weiToUsd(hourlyRate,marketPrice)
    console.log(hourlyRate)
    return {fetchRatings,uid,address,pastRatingsHistory,pastTipsHistory,marketPrice,userData,orgname,hourlyRate}
}
export default myProfile;