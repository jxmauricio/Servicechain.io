import web3 from "./web3";
import Factory from "./build/Factory.json";
const addressOfDeployedFactory = '0x5B4EB7c12ec440Ce9FfbBc7F6C60434D66b7B2C3';
//lets us interact with the factory contract and call its methods 
const instance = new web3.eth.Contract(
  Factory.abi,
  addressOfDeployedFactory
);
 
export default instance;