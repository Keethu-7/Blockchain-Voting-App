
const BlockchainContract = artifacts.require("blockchain_contract");

module.exports = function (deployer) {
    deployer.deploy(BlockchainContract);
};
