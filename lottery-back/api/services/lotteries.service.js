const config = require('../../config/config');

// Ethereum config
const ethereumUrl = `http://${config.eth.nodeUrl}:${config.eth.nodePort}`;
const lotteryFactoryContractAddress = config.contracts.LotteryFactory.contractAddress;
const lotteryFactoryContractAbi = config.contracts.LotteryFactory.contractAbi;
const lotteryContractAbi = config.contracts.Lottery.contractAbi;
const gasLimit = config.eth.transactionOptions.gas;
const gasPrice = config.eth.transactionOptions.gasPrice;

// Se levanta instancia de Web3
const Web3 = require('web3');
const web3 = new Web3(ethereumUrl); 
 
/**
 * Return a list of registered lotteries.
 */
async function getLotteries() {

  // Se crea el objeto de contrato de Factory
  const contract = new web3.eth.Contract(lotteryFactoryContractAbi, lotteryFactoryContractAddress);
 
  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];
 
  var result;
  var error;
  await contract.methods.getLotteries().call({from: sender})
  .then((r) => {
    result = r;
    console.log(r);
  }).catch((e) => {
    error = e;
    console.log(e);
  });

  if (error == undefined){
      return { message: 'Ok', result: result };
  }else{
      return { message: 'KO' };
  } 
}
 
/**
 * Return all the information of the lottery corresponding to the given address.
 * @param {string} lotteryAddress address of the lottery
 */
async function getLottery(lotteryAddress) {

  // Se crea el objeto de contrato de Factory
  const contract = new web3.eth.Contract(lotteryContractAbi, lotteryAddress);
 
  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];
 
  var result;
  var error;
  await contract.methods.getLottery().call({from: sender})
  .then((r) => {
    result = r;
    console.log(r);
  }).catch((e) => {
    error = e;
    console.log(e);
  });
 
  if (error == undefined){
      return { message: 'Ok', result: result };
  }else{
      return { message: 'KO' };
  } 
}
 
/**
 * Create a new lottery in the system. It returns the transactionHash,
 * address of the created lottery and address of the creator.
 * @param {string} privateKey prijvate key of the operator (tx sender)
 * @param {object} lotteryData object with lottery parameters
 */
async function createLottery(privateKey, lotteryData) {
  // Lottery data
  const {
    maxNumberParticipants,
    participationPrice,
    participationPot,
    prize,
  } = lotteryData;

  const contract = new web3.eth.Contract(lotteryFactoryContractAbi, lotteryFactoryContractAddress);
 
  const sender = web3.eth.accounts.privateKeyToAccount(privateKey);
  var participationPrice_wei = web3.utils.toWei(participationPrice.toString());
  var participationPot_wei = web3.utils.toWei(participationPot.toString());
  var prize_wei = web3.utils.toWei(prize.toString());

  var result;
  var error;
  await contract.methods.createLottery(
        maxNumberParticipants, 
        participationPrice_wei, 
        participationPot_wei, 
        prize_wei
      ).send({
          from: sender.address, 
          gasPrice: gasPrice,
          gasLimit: gasLimit
    })
  .then((r) => {
    result = r;
    console.log(r);
  }).catch((e) => {
    error = e;
    console.log(e);
  });
 
  if (error == undefined){
      return { message: 'Ok', transaction: result.transactionHash, address: result.to, creator: result.from };
  }else{
      return { message: 'KO' };
  } 
}
 
/**
 * Return a list of lottery's participants.
 * @param {string} lotteryAddress address of the lottery
 */
async function getParticipants(lotteryAddress) {

  // Se crea instancia del objeto del contrato de Loteria
  const contract = new web3.eth.Contract(lotteryContractAbi, lotteryAddress);

  const accounts = await web3.eth.getAccounts();
  const sender = accounts[0];
 
  var result;
  var error;
  await contract.methods.getParticipants().call({from: sender})
  .then((r) => {
    result = r;
    console.log(r);
  }).catch((e) => {
    error = e;
    console.log(e);
  });
 
  if (error == undefined){
      return { message: 'Ok', result: result };
  }else{
      return { message: 'KO' };
  } 
}
 
/**
 * Allow to participate in a lottery. It returns the transactionHash,
 * address of the lottery and address of the participant.
 * @param {string} privateKey private key of the operator (tx sender)
 * @param {string} lotteryAddress address of the lottery
 */
async function addParticipant(privateKey, lotteryAddress) {

  //Se levanta isntancia del contrato Lottery
  const contract = new web3.eth.Contract(lotteryContractAbi, lotteryAddress);
 
  const sender = web3.eth.accounts.privateKeyToAccount(privateKey);
  const parametrosLoteria = await getLottery(lotteryAddress);

  var balance = await web3.eth.getBalance(sender.address);
  console.log(balance);
 
  var result;
  var error;
  await contract.methods.addParticipant().send({
    from: sender.address,
    value: parametrosLoteria.result[1],  //Aqui es donde en vez de meter el value fijo, se busca en el getLottery
    gasPrice: gasPrice,
    gasLimit: gasLimit
 
    })
  .then((r) => {
    result = r;
    console.log(r);
  }).catch((e) => {
    error = e;
    console.log(e);
  });
 
  balance = await web3.eth.getBalance(sender.address);
  console.log(balance);

  if (error == undefined){
      return { message: 'Ok', transaction: result.transactionHash, address: result.to, participant: result.from };
  }else{
      return { message: 'KO' };
  } 
}
 
/**
 * Allow a participant to withdraw its participation, ang get a refund.
 * It returns the transactionHash, address of the lottery and address
 * of the participant.
 * @param {string} privateKey private key of the operator (tx sender)
 * @param {string} lotteryAddress address of the lottery
 */
async function withdrawParticipation(privateKey, lotteryAddress) {
  const contract = new web3.eth.Contract(lotteryContractAbi, lotteryAddress);

  const sender = web3.eth.accounts.privateKeyToAccount(privateKey);

  var balance = await web3.eth.getBalance(sender.address);
  console.log(balance);
 
  var result;
  var error;
  await contract.methods.withdrawParticipation().send({from: sender.address})
  .then((r) => {
    result = r;
    console.log(r);
  }).catch((e) => {
    error = e;
    console.log(e);
  });
 
  balance = await web3.eth.getBalance(sender.address);
  console.log(balance);

  if (error == undefined){
      return { message: 'Ok', transaction: result.transactionHash, address: result.to, participant: result.from };
  }else{
      return { message: 'KO' };
  } 
}
 
/**
 * Allow the creator of a lottery to raffle the prize between its
 * participants. It returns the transactionHash, address of the
 * lottery and the address of the winner.
 * @param {string} privateKey private key of the operator (tx sender)
 * @param {string} lotteryAddress address of the lottery
 */
async function raffle(privateKey, lotteryAddress) {

  const contract = new web3.eth.Contract(lotteryContractAbi, lotteryAddress);

  const sender = web3.eth.accounts.privateKeyToAccount(privateKey);

  var result;
  var error;
  await contract.methods.raffle().send({
    from: sender.address,
    gasPrice: gasPrice,
    gasLimit: gasLimit})
    .then((r) => {
      result = r;
      console.log(r);
    }).catch((e) => {
      error = e;
      console.log(e);
    });

  // Hacemos una llamada a la funcion que recupera al winner  
  const winner = await contract.methods.getWinner().call({from: sender.address});
  console.log(winner);

  balanceWinner = await web3.eth.getBalance(winner);
  console.log(balanceWinner);

  if (error == undefined){
      return { message: 'Ok', transaction: result.transactionHash, address: result.to, winner: winner };
  }else{
      return { message: 'KO' };
  } 
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


