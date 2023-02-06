const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");
 
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);
 
const campaignPath = path.resolve(__dirname, "contracts", "ServiceChain.sol");
console.log(campaignPath)
const source = fs.readFileSync(campaignPath, "utf8");
 
const input = {
  language: "Solidity",
  sources: {
    "ServiceChain.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};
console.log(JSON.parse(solc.compile(JSON.stringify(input))))
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "ServiceChain.sol"
];
 
fs.ensureDirSync(buildPath);
 
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}