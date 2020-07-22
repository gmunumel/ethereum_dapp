// lotteries.service.js

const config = require('../../config/config');


/**
 * Return a list of registered lotteries.
 * curl: curl --location --request GET 'http://localhost:10010/lotteries'
 */
async function getLotteries() {
  // Ethereum config
  const ethereumUrl = `http://${config.eth.nodeUrl}:${config.eth.nodePort}`;
  const gasLimit = config.eth.transactionOptions.gas;
  const gasPrice = config.eth.transactionOptions.gasPrice;

  // SimpleStorage contract specs
  const lotteryFactoryContractAddress = config.contracts.LotteryFactory.contractAddress;
  const lotteryFactoryContractAbi = config.contracts.LotteryFactory.contractAbi;
  const lotteryFactoryContractBytecode = config.contracts.LotteryFactory.contractBytecode;

  const Web3 = require('web3');
  const web3 = new Web3(ethereumUrl);
  const contract = new web3.eth.Contract(lotteryFactoryContractAbi, lotteryFactoryContractAddress);

  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];

  var result;

  await contract.methods.getLotteries().call({from: sender})
	.then((r) => {
		result = r;
		console.log(r);
	}).catch((error) => {
		result = error;
		console.log(error);
	});

  return { message: 'Ok', result: result };
}

/**
 * Return all the information of the lottery corresponding to the given address.
 * @param {string} lotteryAddress address of the lottery
 * curl: curl --location --request GET 'http://localhost:10010/lotteries/0x5CB1848a868b67C6E8D2719647Ffe6c092a64ebd'
 */
async function getLottery(lotteryAddress) {
  // Ethereum config
  const ethereumUrl = `http://${config.eth.nodeUrl}:${config.eth.nodePort}`;
  const gasLimit = config.eth.transactionOptions.gas;
  const gasPrice = config.eth.transactionOptions.gasPrice;

  // SimpleStorage contract specs
  const lotteryFactoryContractAddress = config.contracts.LotteryFactory.contractAddress;
  const lotteryFactoryContractAbi = config.contracts.LotteryFactory.contractAbi;
  const lotteryFactoryContractBytecode = config.contracts.LotteryFactory.contractBytecode;
  const lotteryContractAbi = config.contracts.Lottery.contractAbi;

  const Web3 = require('web3');
  const web3 = new Web3(ethereumUrl);
  const contract = new web3.eth.Contract(lotteryContractAbi, lotteryAddress);

  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];

  var result;
  await  contract.methods.getLottery(lotteryAddress).call({from: sender})
	.then((r) => {
		result = r;
		console.log(result);
	}).catch((error) => {
		result = error;
		console.log(error);
	});

  return { message: 'Ok', result: result };
}

/**
 * Create a new lottery in the system. It returns the transactionHash,
 * address of the created lottery and address of the creator.
 * @param {string} privateKey prijvate key of the operator (tx sender)
 * @param {object} lotteryData object with lottery parameters
 * curl: curl --location --request POST 'http://localhost:10010/lotteries/' \
	--header 'private_key: 0x91fb6dbf3ee4691748661bc47118e82a32678bf066b73ab6967c06b4abcc3800' \
	--header 'Content-Type: application/json' \
	--data-raw '{
	    "maxNumberParticipants": 2,
	    "participationPrice": 3,
	    "prize": 2,
	    "participationPot": 10
	}'
 */
async function createLottery(privateKey, lotteryData) {
  // Lottery data
  const {
    maxNumberParticipants,
    participationPrice,
    participationPot,
    prize,
  } = lotteryData;

  const ethereumUrl = `http://${config.eth.nodeUrl}:${config.eth.nodePort}`;
  const gasLimit = config.eth.transactionOptions.gas;
  const gasPrice = config.eth.transactionOptions.gasPrice;

  // SimpleStorage contract specs
  const lotteryFactoryContractAddress = config.contracts.LotteryFactory.contractAddress;
  const lotteryFactoryContractAbi = config.contracts.LotteryFactory.contractAbi;
  const lotteryFactoryContractBytecode = config.contracts.LotteryFactory.contractBytecode;

  const Web3 = require('web3');
  const web3 = new Web3(ethereumUrl);
  const contract = new web3.eth.Contract(lotteryFactoryContractAbi, lotteryFactoryContractAddress);

  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];

  contract.methods.createLottery(maxNumberParticipants, participationPrice, participationPot, prize).send({
	from: sender, 
	gasPrice: gasPrice,
	gasLimit: gasLimit
  	})
	.then((result) => {
		console.log(result);
	}).catch((error) => {
		console.log(error);
	});

  return { message: 'Ok' };
}

/**
 * Return a list of lottery's participants.
 * @param {string} lotteryAddress address of the lottery
 * curl: curl --location --request GET 'http://localhost:10010/lotteries/0x5CB1848a868b67C6E8D2719647Ffe6c092a64ebd/participants'
 */
async function getParticipants(lotteryAddress) {
  // TODO
  return { message: 'Ok' };
}

/**
 * Allow to participate in a lottery. It returns the transactionHash,
 * address of the lottery and address of the participant.
 * @param {string} privateKey private key of the operator (tx sender)
 * @param {string} lotteryAddress address of the lottery
 * curl: http://localhost:10010/lotteries/0x5CB1848a868b67C6E8D2719647Ffe6c092a64ebd/participants
 */
async function addParticipant(privateKey, lotteryAddress) {
  // TODO
  return { message: 'Ok' };
}

/**
 * Allow a participant to withdraw its participation, ang get a refund.
 * It returns the transactionHash, address of the lottery and address
 * of the participant.
 * @param {string} privateKey private key of the operator (tx sender)
 * @param {string} lotteryAddress address of the lottery
 * curl: curl --location --request PUT 'http://localhost:10010/lotteries/0x5CB1848a868b67C6E8D2719647Ffe6c092a64ebd/participants' \
	--header 'private_key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d' \
	--header 'Content-Type: application/json'
 */
async function withdrawParticipation(privateKey, lotteryAddress) {
  // TODO
  return { message: 'Ok' };
}

/**
 * Allow the creator of a lottery to raffle the prize between its
 * participants. It returns the transactionHash, address of the
 * lottery and the address of the winner.
 * @param {string} privateKey private key of the operator (tx sender)
 * @param {string} lotteryAddress address of the lottery
 * curl: curl --location --request PUT 'http://localhost:10010/lotteries/0x5CB1848a868b67C6E8D2719647Ffe6c092a64ebd' \
	--header 'private_key: 0x91fb6dbf3ee4691748661bc47118e82a32678bf066b73ab6967c06b4abcc3800' \
	--header 'Content-Type: application/json'
 */
async function raffle(privateKey, lotteryAddress) {
  // TODO
  return { message: 'Ok' };
}


module.exports = {
  getLotteries,
  getLottery,
  createLottery,
  getParticipants,
  addParticipant,
  withdrawParticipation,
  raffle,
};
