import React, { useState,useEffect } from 'react'
import {Form,Table,Message,Input,Button,Container,Icon,Divider,Dropdown} from 'semantic-ui-react';
import axios from 'axios';
import { options } from '@/helper/conversions';
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
  
  const {empOptions,address,marketPrice,userData} = props;
  const [selectedEmp,setSelectedEmp] = useState('');
  
  
  const onSubmit = async(gratuity)=>{
    const {tip,bill} = calculateTipAndBill(totalAmount,gratuity);
    console.log(tip,bill);
    console.log(address,userData.publicAddress,selectedEmp);
    await service(address).methods.sendTip(selectedEmp).send({from:userData.publicAddress,value:usdToWei(tip,marketPrice)});
    await service(address).methods.deposit().send({from:userData.publicAddress,value:usdToWei(bill,marketPrice)});
  }

  const calculateTipAndBill= (billAmount,gratuity)=>{
    const totalPrice = billAmount * (1+gratuity);
    const tip = totalPrice * (gratuity);
    const bill = billAmount
    return {totalPrice,tip,bill}
  }

  return (
    <Container>
      <Dropdown placeholder = "Select Waiter" selection options = {empOptions} onChange ={(event,data)=>{setSelectedEmp(data.value)}}/>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Total Bill Amount</label>
          <Input 
          label = 'USD'
          labelPosition='right'
          placeholder='$'
          type='number' 
          value={totalAmount} onChange={(e)=>setTotalAmount(parseInt(e.target.value))}></Input>
          <Container textAlign='center' style={{marginTop:'20px'}}>
          <Button value = {.15} onClick = {(e,d)=>onSubmit(d.value)}>15% Gratuity<Divider horizontal></Divider><label>You will pay: {Math.round(totalAmount*1.15 *100)/100}</label></Button>
          <Button value = {.18} onClick = {(e,d)=>onSubmit(d.value)}>18% Gratuity<Divider horizontal></Divider><label>You will pay: {Math.round(totalAmount*1.18 *100)/100}</label></Button>
          <Button value = {.2} onClick = {(e,d)=>onSubmit(d.value)}>20% Gratuity<Divider horizontal></Divider><label>You will pay: {Math.round(totalAmount*1.2 *100)/100}</label></Button>
          </Container>
        </Form.Field>
      </Form>
    </Container>
  )
}

tip.getInitialProps = async(props)=>{
  const {uid,address} = props.query;
  const ref= doc(db,"Users",uid);
  const snapShot = await getDoc(ref);
  const userData = snapShot.data()

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
  
  const response = await axios.request(options);
  const marketPrice = response.data.ethereum.usd

return {empOptions,address,marketPrice,userData}
}
export default tip;