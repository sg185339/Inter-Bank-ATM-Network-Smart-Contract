const InterBankNetwork = artifacts.require("InterBankNetwork");

module.exports = function(deployer) {
deployer.deploy(InterBankNetwork);
};
