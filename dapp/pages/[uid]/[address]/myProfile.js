import React from 'react'
import service from '@/ethereum/service';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/config/firebase';
import { doc,getDoc,collection,query, where,getDocs } from 'firebase/firestore';
import { Table,Rating,Container,Grid,Statistic,Icon,Message } from 'semantic-ui-react';
import { weiToUsd } from '@/helper/conversions';
import axios from 'axios';
import { options } from '@/helper/conversions';
import average from '@/helper/average';
import MyProfileManager from './myProfileManager';
function myProfile(props) {
const {user} = useAuth();
const {fetchRatings,customerAddrs,pastRatingsHistory,pastTipsHistory,marketPrice,userData} = props
  return (
    <Container textAlign='center'> 
    {pastRatingsHistory.length ==0 && pastTipsHistory ==0 ? <Message header='Uh Oh!' content="Looks like you don't have any ratings or tips yet. Come back later when you do!"/>: 
    <Container>
    <h1>Employee Statistics</h1>
    <Grid celled>
        <Grid.Row>
            <Grid.Column width = {11}>
                <Container>  
                <Table basic='very' celled collapsing>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Customer</Table.HeaderCell>
                    <Table.HeaderCell>Your Rating</Table.HeaderCell>
                </Table.Row>
                {pastRatingsHistory.map((data)=>(
                        <Table.Row>
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
            {pastTipsHistory.map((data)=>(
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
                <Statistic.Value>${average(pastTipsHistory)}</Statistic.Value>
                <Statistic.Label>Average Tips</Statistic.Label>
            </Statistic>
            </Grid.Column>
        </Grid.Row>
    </Grid>
    </Container>
}
</Container>
  )
}


myProfile.getInitialProps = async (props) => {
    //replace this later
    // const response = await axios.request(options);
    // const marketPrice = response.data.ethereum.usd
    const marketPrice = 1600;
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
    const customerAddrs = fetchRatings.map(data=>{
        return data.returnValues.sender;
    })
    if (customerAddrs.length!=0) {
        const ref = collection(db,"Users")
        const q = query(ref,where("publicAddress","in",customerAddrs),where("role","==","customer"));
        const querySnapshot = await getDocs(q);
        
        let i = 0;
        querySnapshot.forEach((doc)=>{
          const rating = fetchRatings[i].returnValues.rating
          const data = doc.data()
          pastRatingsHistory.push(
            {first:data.first,last:data.last,value:rating}
          )
          i = i +1;
        });
    
       
        i = 0;
        querySnapshot.forEach((doc)=>{
          const tips = weiToUsd(parseInt(fetchTips[i].returnValues.tipAmount),marketPrice);
          const data = doc.data();
          pastTipsHistory.push(
            {first:data.first,last:data.last,value:tips}
          )
          i = i +1;
        });
    }
   
    

    return {fetchRatings,uid,address,pastRatingsHistory,pastTipsHistory,marketPrice,userData}
}
export default myProfile;