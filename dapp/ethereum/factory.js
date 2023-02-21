import web3 from "./web3";
import Factory from "./build/Factory.json";
const addressOfDeployedFactory = '0x418977Dd71A8418d7174e46ef7018F6F976D9A83';
//lets us interact with the factory contract and call its methods 
const instance = new web3.eth.Contract(
  Factory.abi,
  addressOfDeployedFactory
);
 
export default instance;