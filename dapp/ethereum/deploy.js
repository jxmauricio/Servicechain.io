const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/Factory.json");
 
const provider = new HDWalletProvider(
    'coffee define visit symbol craft leader olive ketchup yard want then play',
    // remember to change this to your own phrase!
    'https://goerli.infura.io/v3/e3096431bf7d415999061c3b795262a3'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);
 
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
 
  console.log("Attempting to deploy from account", accounts[0]);
  console.log(compiledFactory.abi)
  console.log(compiledFactory.evm.bytecode.object)
  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "5000000", from: accounts[0] });
 
  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();