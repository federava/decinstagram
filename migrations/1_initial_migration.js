const Migrations = artifacts.require("decinstagram/src/contracts/Migrations.sol");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};
