const Decinstagram = artifacts.require("decinstagram/src/contracts/Decinstagram");

module.exports = function (deployer) {
  deployer.deploy(Decinstagram);
};
