import Web3 from "web3";
import blockchainContract from "../contracts/blockchain_contract.json"; 
console.log("Imported blockchainContract:", blockchainContract);
console.log("Contract Networks:", blockchainContract.networks);

let web3;
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  window.ethereum.request({ method: "eth_requestAccounts" }); 
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545")); 
}

const getContract = async () => {
  const networkId = await web3.eth.net.getId();
  console.log("Network ID:", networkId);

  const deployedNetwork = blockchainContract.networks[networkId];
  console.log("Deployed Network:", deployedNetwork);

  if (!deployedNetwork) {
    console.error("Contract not deployed on the current network!");
    return null;
  }
  console.log("Contract Address in Frontend:", deployedNetwork.address);
  
  return new web3.eth.Contract(blockchainContract.abi, deployedNetwork.address);
};
const contractInstance = await getContract();
console.log("Contract Instance:", contractInstance);
console.log("Contract Methods:", contractInstance.methods);


export { web3, getContract };
