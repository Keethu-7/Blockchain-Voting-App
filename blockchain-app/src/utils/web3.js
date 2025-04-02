import Web3 from "web3";
import blockchainContract from "../contracts/blockchain_contract.json";

console.log("Imported blockchainContract:", blockchainContract);


let web3;

const initWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" }); // Request MetaMask access
    } catch (error) {
      console.error("User denied MetaMask access:", error);
    }
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    console.log("No MetaMask detected! Using Ganache.");
    web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  }
};

await initWeb3();


const getContract = async () => {
  const networkId = await web3.eth.net.getId();
  console.log("Network ID:", networkId);
  
  const deployedNetwork = blockchainContract.networks[networkId];
  if (!deployedNetwork) {
      console.error("Contract not deployed on this network!");
      return null;
  }

  console.log("Contract Address:", deployedNetwork.address);
  return new web3.eth.Contract(blockchainContract.abi, deployedNetwork.address);
};

export { web3, getContract };
