
//const blockchainContract= artifacts.require("./blockchain_contract.sol");
const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
 
};
