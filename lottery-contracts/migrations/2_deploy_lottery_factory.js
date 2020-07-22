
var LotteryFactory = artifacts.require("LotteryFactory");

module.exports = async function (deployer) {
   await deployer.deploy(LotteryFactory);
};
