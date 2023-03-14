import web3 from "./web3";
import Factory from "./build/Factory.json";
const addressOfDeployedFactory = '0x2A87e3fF982eFed3BCDEF6D475CCf6908609fD40';
//lets us interact with the factory contract and call its methods 
const instance = new web3.eth.Contract(
  Factory.abi,
  addressOfDeployedFactory
);
 
export default instance;