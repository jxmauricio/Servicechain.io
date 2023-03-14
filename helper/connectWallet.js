import Web3 from 'web3';
//a function that is called to connect to the current instance of metamask installed in the users browser
export default async()=>{
    let web3;
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        // We are in the browser and metamask is running.
        window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum);
        } else {
        // We are on the server *OR* the user is not running metamask
        const provider = new Web3.providers.HttpProvider(
            "https://goerli.infura.io/v3/e3096431bf7d415999061c3b795262a3"
        );
        web3 = new Web3(provider);
        }
    
    return web3
    }