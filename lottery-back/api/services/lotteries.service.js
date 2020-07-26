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
 * curl: curl --location --request GET 'http://localhost:10010/lotteries'
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
 * curl: curl --location --request GET 'http://localhost:10010/lotteries/0x5CB1848a868b67C6E8D2719647Ffe6c092a64ebd'

 curl --location --request GET 'http://localhost:10010/lotteries/0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696'
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
 * curl: curl --location --request POST 'http://localhost:10010/lotteries/' \
  --header 'private_key: 0x91fb6dbf3ee4691748661bc47118e82a32678bf066b73ab6967c06b4abcc3800' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "maxNumberParticipants": 2,
      "participationPrice": 3,
      "prize": 2,
      "participationPot": 10
  }'

 * curl: curl --location --request POST 'http://localhost:10010/lotteries/' \
  --header 'private_key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "maxNumberParticipants": 2,
      "participationPrice": 3,
      "prize": 2,
      "participationPot": 10
  }'
 * curl: curl --location --request POST 'http://localhost:10010/lotteries/' \
  --header 'private_key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "maxNumberParticipants": 2,
      "participationPrice": 3,
      "prize": 2,
      "participationPot": 5 
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

  const contract = new web3.eth.Contract(lotteryFactoryContractAbi, lotteryFactoryContractAddress);
 
  const sender = web3.eth.accounts.privateKeyToAccount(privateKey);
  var participationPrice_wei  = web3.utils.toWei(participationPrice.toString())
  var participationPot_wei  = web3.utils.toWei(participationPot.toString())
  var prize_wei  = web3.utils.toWei(prize.toString())

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
 * curl: curl --location --request GET 'http://localhost:10010/lotteries/0x5CB1848a868b67C6E8D2719647Ffe6c092a64ebd/participants'

 curl --location --request GET 'http://localhost:10010/lotteries/0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696/participants'
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
 * curl: curl --location --request POST http://localhost:10010/lotteries/0x5CB1848a868b67C6E8D2719647Ffe6c092a64ebd/participants \
         --header 'private_key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d' \
    --header 'Content-Type: application/json' 

curl --location --request POST http://localhost:10010/lotteries/0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696/participants \
        --header 'private_key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d' \
        --header 'Content-Type: application/json'

curl --location --request POST http://localhost:10010/lotteries/0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696/participants \
        --header 'private_key: 0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1' \
        --header 'Content-Type: application/json'

curl --location --request POST http://localhost:10010/lotteries/0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696/participants \
        --header 'private_key: 0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c' \
        --header 'Content-Type: application/json'

curl --location --request POST http://localhost:10010/lotteries/0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696/participants \
        --header 'private_key: 0x646f1ce2fdad0e6deeeb5c7e8e5543bdde65e86029e2fd9fc169899c440a7913' \
        --header 'Content-Type: application/json'



curl --location --request POST http://localhost:10010/lotteries/0x0d370B0974454D7b0E0E3b4512c0735A6489A71A/participants \
        --header 'private_key: 0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1' \
        --header 'Content-Type: application/json'


0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F
curl --location --request POST http://localhost:10010/lotteries/0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F/participants \
        --header 'private_key: 0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1' \
        --header 'Content-Type: application/json'

curl --location --request POST http://localhost:10010/lotteries/0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F/participants \
        --header 'private_key: 0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c' \
        --header 'Content-Type: application/json'


loteria: 0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696
curl --location --request POST http://localhost:10010/lotteries/0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696/participants \
        --header 'private_key: 0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1' \
        --header 'Content-Type: application/json'

curl --location --request POST http://localhost:10010/lotteries/0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696/participants \
        --header 'private_key: 0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c' \
        --header 'Content-Type: application/json'

 */
 
/*Creo que aqui falta que el participante indique la pasta que va a enviar */
/*async function addParticipant(privateKey, lotteryAddress, value)*/
/* si no hay que recuperar con getLottery, el value
 
/*Con el private saco el public */
/*no puedo probar el URL mañana lo hacemos */
async function addParticipant(privateKey, lotteryAddress) {

  //Se levanta isntancia del contrato Lottery
  const contract = new web3.eth.Contract(lotteryContractAbi, lotteryAddress);
 
  const sender = web3.eth.accounts.privateKeyToAccount(privateKey)
  const parametrosLoteria = await getLottery(lotteryAddress) //invocamos la función de js 

  var balance = await web3.eth.getBalance(sender.address);
  console.log(balance);
 
  var result;
  var error;
  await contract.methods.addParticipant().send({
    from: sender.address,
    value: parametrosLoteria.result[1],  //Aqui es donde en vez de meter el value fijo, se bnusca en el getLottery
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
 * curl: curl --location --request PUT 'http://localhost:10010/lotteries/0x5CB1848a868b67C6E8D2719647Ffe6c092a64ebd/participants' \
  --header 'private_key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d' \
  --header 'Content-Type: application/json'

curl --location --request PUT 'http://localhost:10010/lotteries/0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696/participants' \
  --header 'private_key: 0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1' \
  --header 'Content-Type: application/json'

curl --location --request PUT 'http://localhost:10010/lotteries/0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696/participants' \
  --header 'private_key: 0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c' \
  --header 'Content-Type: application/json'
 */
async function withdrawParticipation(privateKey, lotteryAddress) {
  const contract = new web3.eth.Contract(lotteryContractAbi, lotteryAddress);

  const sender = web3.eth.accounts.privateKeyToAccount(privateKey)

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
 * curl: curl --location --request PUT 'http://localhost:10010/lotteries/0x5CB1848a868b67C6E8D2719647Ffe6c092a64ebd' \
  --header 'private_key: 0x91fb6dbf3ee4691748661bc47118e82a32678bf066b73ab6967c06b4abcc3800' \
  --header 'Content-Type: application/json'

curl --location --request PUT 'http://localhost:10010/lotteries/0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696' \
  --header 'private_key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d' \
  --header 'Content-Type: application/json'


curl --location --request PUT 'http://localhost:10010/lotteries/0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F' \
  --header 'private_key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d' \
  --header 'Content-Type: application/json'

loteria: 0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696
curl --location --request PUT 'http://localhost:10010/lotteries/0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696' \
  --header 'private_key: 0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d' \
  --header 'Content-Type: application/json'
 */
async function raffle(privateKey, lotteryAddress) {

  const contract = new web3.eth.Contract(lotteryContractAbi, lotteryAddress);
  // No se ponen aqui controles, porque ya chequea solidity (el contrato)
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

  // Hacemos un call a la funcion que recupera al winner  
  const winner = await contract.methods.getWinner().call({from: sender.address});
  console.log(winner)

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


