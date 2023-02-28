import web3 from "./web3";
import Factory from "./build/Factory.json";
const addressOfDeployedFactory = '0x8946Ad5ad53E25A4b4d595a33eB712451f5E5b13';
//lets us interact with the factory contract and call its methods 
const instance = new web3.eth.Contract(
  Factory.abi,
  addressOfDeployedFactory
);
 
export default instance;