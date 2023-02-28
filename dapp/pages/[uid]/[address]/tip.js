import React, { useState,useEffect } from 'react'
import {Form,Table,Message,Input,Button,Container,Icon,Divider,Dropdown} from 'semantic-ui-react';
import axios from 'axios';
import { options } from '@/helper/conversions';
import service from '@/ethereum/service';
import factory from '@/ethereum/factory';
import web3 from '@/ethereum/web3';
import { db } from '@/config/firebase';
import { collection, doc,getDocs,query,where } from 'firebase/firestore';
import { auth } from '@/config/firebase';
import { usdToWei } from '@/helper/conversions';
function tip(props) {
  const [totalAmount, setTotalAmount] = useState("");
  // const [empOptions, setEmpOptions] = useState([])
  const {empOptions,address,marketPrice} = props;
  const [selectedEmp,setSelectedEmp] = useState('');
  console.log(selectedEmp);
  
  const onSubmit = async(gratuity)=>{
    const {tip,bill} = calculateTipAndBill(totalAmount,gratuity);
    const accounts = await web3.eth.getAccounts();
    console.log(tip,bill);
    await service(address).methods.sendTip(selectedEmp).send({from:accounts[0],value:usdToWei(tip,marketPrice)});
    await service(address).methods.deposit().send({from:accounts[0],value:usdToWei(bill,marketPrice)});
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
          <Button value = {.15} onClick = {(e,d)=>onSubmit(d.value)}>15% Gratuity<Divider horizontal></Divider><label>You will pay: {Math.round(totalAmount*1.15 *100)/100}</label></Button>
          <Button value = {.18} onClick = {(e,d)=>onSubmit(d.value)}>18% Gratuity<Divider horizontal></Divider><label>You will pay: {Math.round(totalAmount*1.18 *100)/100}</label></Button>
          <Button value = {.2} onClick = {(e,d)=>onSubmit(d.value)}>20% Gratuity<Divider horizontal></Divider><label>You will pay: {Math.round(totalAmount*1.2 *100)/100}</label></Button>
        </Form.Field>
      </Form>
    </Container>
  )
}

tip.getInitialProps = async(props)=>{
  const {uid,address} = props.query;
  const usersRef= collection(db,"Users");
  const q = query(usersRef,where("orgAddress","==",address));
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

  return {empOptions,address,marketPrice}
}
export default tip;