import web3 from "./web3";
import Factory from "./build/Factory.json";
const addressOfDeployedFactory = '0xBeDcF94D68381bB3094a36364C3B4d69AEeA654c'
const instance = new web3.eth.Contract(
  Factory.abi,
  addressOfDeployedFactory
);
 
export default instance;