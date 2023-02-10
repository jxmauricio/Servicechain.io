import web3 from "./web3";
import Factory from "./build/Factory.json";
const addressOfDeployedFactory = '0xECda1e4Dee246F1cBC5CA4442c2d275C084C368f';
const instance = new web3.eth.Contract(
  Factory.abi,
  addressOfDeployedFactory
);
 
export default instance;