import React, { useState,useEffect } from 'react'
import {Form,Table,Segment,Input,Button,Container,Icon,Divider,Dropdown} from 'semantic-ui-react';
import service from '@/ethereum/service';
import factory from '@/ethereum/factory';
import web3 from '@/ethereum/web3';
import { db } from '@/config/firebase';
import { collection, doc,getDocs,query,where,getDoc } from 'firebase/firestore';
import { auth } from '@/config/firebase';
import { usdToWei } from '@/helper/conversions';
import { useAuth } from '@/context/AuthContext';
function tip(props) {
  const [totalAmount, setTotalAmount] = useState("");
  const {marketPrice} = useAuth();
  const {empOptions,address,userData} = props;
  const [selectedEmp,setSelectedEmp] = useState('');
  

  const onSubmit = async(gratuity)=>{
    const {tip,bill} = calculateTipAndBill(totalAmount,gratuity);
    await service(address).methods.sendTip(selectedEmp).send({from:userData.publicAddress,value:usdToWei(tip,marketPrice)});
    await service(address).methods.deposit().send({from:userData.publicAddress,value:usdToWei(bill,marketPrice)});
  }
  //finds the tip amount of the  total bill 
  const calculateTipAndBill= (billAmount,gratuity)=>{
    const totalPrice = billAmount * (1+gratuity);
    const tip = Math.round(totalPrice * (gratuity)*100)/100;
    const bill = billAmount
    return {totalPrice,tip,bill}
  }

  return (
    <Container textAlign='center'>
      <Segment compact  textAlign='center'>
      <Segment compact textAlign='center' style={{margin:'auto'}}>
      <h2>Pick an Employee To Tip!</h2>
      <Dropdown  placeholder = "Select Waiter" selection options = {empOptions} onChange ={(event,data)=>{setSelectedEmp(data.value)}}/>
      </Segment>
      <Segment>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <h3>Total Bill Amount</h3>
          <Input style ={{width:'50%'}}
          label = 'USD'
          labelPosition='right'
          placeholder='$'
          type='number' 
          value={totalAmount} onChange={(e)=>setTotalAmount(parseInt(e.target.value))}></Input>
          
          <Container textAlign='center' style={{marginTop:'20px', padding:'8px'}}>
          
          <Button value = {.15} onClick = {(e,d)=>onSubmit(d.value)}>15% Gratuity<Divider horizontal></Divider><label>You will pay: {Math.round(totalAmount*1.15 *100)/100}</label></Button>
          <Button value = {.18} onClick = {(e,d)=>onSubmit(d.value)}>18% Gratuity<Divider horizontal></Divider><label>You will pay: {Math.round(totalAmount*1.18 *100)/100}</label></Button>
          <Button value = {.2} onClick = {(e,d)=>onSubmit(d.value)}>20% Gratuity<Divider horizontal></Divider><label>You will pay: {Math.round(totalAmount*1.2 *100)/100}</label></Button>
          </Container>
        </Form.Field>
      </Form>
      </Segment>
      </Segment>
    </Container>
  )
}

tip.getInitialProps = async(props)=>{
  const {uid,address} = props.query;
  const ref= doc(db,"Users",uid);
  const snapShot = await getDoc(ref);
  const userData = snapShot.data()
  //grabs the data on possible employees the customer can tip 
  const usersRef= collection(db,"Users");
  const q = query(usersRef,where("orgAddress","==",address),where("role","==","employee"));
  const querySnapshot = await getDocs(q);
  const empOptions = []
  querySnapshot.forEach((doc)=>{
    const data = doc.data();
    
    empOptions.push({ key:`${data.first} ${data.last}`,
    text: `${data.first} ${data.last}`,
    value: `${data.publicAddress}`});
  });
  


return {empOptions,address,userData}
}
export default tip;