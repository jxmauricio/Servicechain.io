This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
First, Make sure to install the dependencies in the package.json file by running:

```bash
npm install
```


Next(get it?), run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

You now should be able to work with our current codebase!

### Editing Smart Contract 
If you wish to make changes to the smart contract 
```bash
cd ./ethereum/contracts
```
In here you will see the solidity file that has the smart contract logic.<br>
Once you have made changes you will need to compile and deploy the factory contract once again in order to get the ABI and Byte Code<br>
We can do this by running:
```bash
node compile.js
node deploy.js
```
After the deploy command you will be give an address in the terminal window similar to the image below:

![deployment](https://user-images.githubusercontent.com/80795080/225056996-8a1e5df9-6f87-4a60-aa08-c4a0bf53ee1d.png)
<br>Copy the contract address and paste it into the factory.js file located at 
```bash
cd ./ethereum/factory.js
```
You will replace the preexisting "addressOfDeployedFactory" with the one you pasted at the location shown below:
![image](https://user-images.githubusercontent.com/80795080/225057653-dcd111f9-0691-4b3a-9a37-d2b95f58ea92.png)
<br>
Now you have a fresh new smart contract that is connected to the frontend of ServiceChain.io! 

### Changing Backend
If you are editing the smart contract you must also change the configuration of the firebase backend to connect to your own! In order to do so go to:
```bash
cd ./config/firebase.js
```
All you have to do is login to [firebase](https://firebase.google.com/), create a project, enable authentication and firestore, then just change the firebase config variable with your own! 

## Deployed Version 
You can also checkout the actual deployed webpage [here](https://servicechain-io.vercel.app/).

## Using the App

Currently our app only works if you have a metamask account since this is a way to interact with the ethereum blockchain with little to no work.
1. Download [Metamask](https://metamask.io/download/) 
2. Create an Account
3. You should be prompted to a screen like this.
<br><img src ="https://user-images.githubusercontent.com/80795080/225046985-9b79bf0b-86fd-4da8-9023-0908b620ea22.png" width ='200' height ='300'><br> 
**Make sure to switch your network to the Goerli Test Network**
<br>
5. Optionally if you wish to use actions in our app like sending ratings, tips, etc. You must load your account with test ether. In order to do so go to to a [faucet](https://goerlifaucet.com/) and paste your public address from metamask which is the highlighted value in the image below.
<br> <br><img src ="https://user-images.githubusercontent.com/80795080/225049758-e570310c-452a-4a9b-98ce-92e9aa570ba1.png"><br> 
6. Head to our [website](https://servicechain-io.vercel.app/) and click signup to create your own account and use the app! 

## Test Accounts
If you wish to just browse the site, we have an account for each user type. Note that functionalities like tipping **will not work** unless you have completed step 5.
<br>
<br>
User Type: Employee<br>
Username: je@gmail.com<br>
Password: password<br>
<br>
User Type: Manager<br>
Username: jm@gmail.com  <br>
Password: password<br>
<br>
User Type: Customer<br>
Username: kk@gmail.com  <br>
Password: password<br>
<br>
## Extras
I hope you enjoy playing around and improving our dapp. Feel free to point out any flaws or inefficiencies that can be improved upon. After all the beauty of a DAPP is that its all open source!



