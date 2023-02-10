import React from 'react'
import service from '@/ethereum/service';
import factory from '../../ethereum/factory'
function rating(props) {
  return (
    <div><h3>For {props.orgName}</h3></div>
  )
}
//This connects the current service contract with the one clicked by our user
rating.getInitialProps = async (props)=>{
    const {address} = props.query;
    const Service = service(address);
    const orgName = await factory.methods.orgNames(address).call();
    return {address,Service,orgName}
}
export default rating;