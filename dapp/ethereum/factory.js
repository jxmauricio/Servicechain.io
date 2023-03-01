import web3 from "./web3";
import Factory from "./build/Factory.json";
const addressOfDeployedFactory = '0x90b8120b11FE8bDF5D1eF20842d48641C6265790';
//lets us interact with the factory contract and call its methods 
const instance = new web3.eth.Contract(
  Factory.abi,
  addressOfDeployedFactory
);
 
export default instance;