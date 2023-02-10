import web3 from "./web3";
import Service from './build/Service.json';
//this file is used to connect to a service and allow for use of the contract
export default (address)=>{
    return new web3.eth.Contract(Service.abi,address);
}