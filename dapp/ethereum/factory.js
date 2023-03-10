import web3 from "./web3";
import Factory from "./build/Factory.json";
const addressOfDeployedFactory = '0xA650fa5DEE91C3010295250d0433C2a3EC74c998';
//lets us interact with the factory contract and call its methods 
const instance = new web3.eth.Contract(
  Factory.abi,
  addressOfDeployedFactory
);
 
export default instance;