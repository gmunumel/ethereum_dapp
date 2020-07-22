t ganache = require("ganache-cli");
const Web3 = require('web3');
 
//Se inicializa la instancia de web3 como objeto de objeto de conexion de web3
web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
//console.log(web3)
 
 
 
/******* Este Codigo sería si hubiese un metamask u otro tipo de conector ya levantado en cliente
 Realmente asi es como se haría: Se miraria desde el cliente si ya tiene metamask, y se inyectaria en el conector de web3 del cliente
  // if (typeof web3 !== 'undefined') {
  //     web3 = new Web3(web3.currentProvider);
  // } else {
  //     // set the provider you want from Web3.providers
  //     web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  // }
******/
 
//Si se fuese a la red real con Infura, se haría algo como:
 
 
    //**** Se carga el conector de la cartera de truffle.
    /***** Se carga la menmonica que hace de conector con el nodo
    const mnemonic = "orange apple banana ... ";
    //const HDWalletProvider = require("@truffle/hdwallet-provider");
    /***** Se crea el conector con infura, y se levanta la instancia de truffle
    //new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/<INFURA_PROJECT_ID>", 2);
 
*/
 
//Se conecta web3 mediante el nodo de pruebas de ganache (previamente mediante consola se ha ejecutado el comando ganache-cli y se ha dejado  abierto el nodo)
//web3.setProvider(ganache.provider());
 
//Se comprueba que instancia de web3 es un objeto funcionando
//console.log(web3)
 
//Ahora con el nodo levantado y web3 conectado pasamos a hacer una pequeñea prueba para mandar dinero de una cuenta a otra de nuestra cartera de ganache
//Pero primero probamos a poder crear una nueva cuenta:
var Accounts = require('web3-eth-accounts');
var accounts = new Accounts('ws://localhost:8545');
const cuentas = web3.eth.accounts.create(web3.utils.randomHex(32));
console.log(cuentas)
 
//Guardamos para la prueba la publica y privada generada
/*
  address: '0xff45C14342d1F4f4b0FFf1678Dd47E09E03ef1cC',
  privateKey: '0xf4246c152c102cd0546e381c798671af134f32d84be5116496bd9bd253ec96ac',
*/
 
//Ahora si hacemos la prueba de mandar dinero de una cuenta a otra:
 
//CUIDADO LLAMADA ASINCRONA
async function mandaPrueba() {
const accounts = await web3.eth.getAccounts()
 
//Definimos sender y receiver
const sender = accounts[0]
const receiver = accounts[1]
console.log(sender)
console.log(receiver)
  
var totalBalance = await web3.eth.getBalance(sender).then(console.log);
console.log(totalBalance)
 
// Mandamos una cantidad loca de ethers para comprobar que funciona. 
 
// ATENCION NO HACE FALTA FIRMAR LA TRANSACCION POR QUE WEB3 A CONECTADO CON EL NODO DE MANERA DIRECTA Y HA RECUPERADO LAS PRIVADAS
// EN UNA RED REAL HABRÍA QUE PASAR LA PRIVADA QUE ES LO QUE VA  PASAR EN LOS LOTEROS QUE NO TENEMOS LAS PRIVADAS  
 
web3.eth.sendTransaction({
  from: sender,
  to: receiver,
  value: '10000000000000000000'
})
 
}
mandaPrueba()
 
 
 
// LLEGADOS A ESTE PUNTO ES MUY SENCILLO YA HACER CUALQUIER INTERACCION:
 
// CREAR UN CONTRATO NUEVO:
//HAY PARAMETROS QUE SE DEFINEN EN LOTTERYBACK/CONFIG
    var myContract = new web3.eth.Contract(ABI, {
      from: sender, 
      gasPrice: '20000000000',
      data: "byteCode"
    });
 
 
 
// y ya con el contrato desplegado interactuamos con las funciones_
  const contratoLotero = web3.eth.Contract(contract_abi, contract_address);
 
// En un call no hace falta el from ni gas ni NamedNodeMap,. ya que son llamadas GRATUITAS. son las funciones de tipo public view
  contratoLotero.methods.funciona().call();
 
// aqui si hace falta el from y el gas etc, hay dos opciones:
// 1) EL send lo hagamos nosotros desde nuestra wallet creada por ganache
// tirado porque cogemos una de las deiz cuentas y tiramos pa alante
 
// Ejemplo del lotero que crea una loto, y al cuenta es de nuetsra cuenta de ganache
  contratoLotero.methods.createLottery().send({
    from: sender,
    gasPrice: '20000000000'
  })
 
 
// Si la cuenta que se va a usar es una aleatoria (es decir una que un usuario de eth tiene) entonces se complica, 
// ya que hay que pasar la cuenta y la privada ( que es como dijo el profesor en el enunciado, a menos que obligasemos a inyectar metamask en web3)
 
// Para este ejercicio: Creamos una cuenta y transferimos eths
 
const cuentaPrueba = web3.eth.accounts.create(web3.utils.randomHex(32));
console.log(cuentaPrueba)
 
async function mandaPrueba2(acc) {
  const accounts = await web3.eth.getAccounts()
  
  //Definimos sender y receiver
  const sender = accounts[2]
  const receiver = acc
  console.log(sender)
  console.log(receiver)
    
  var totalBalance = await web3.eth.getBalance(sender).then(console.log);
  console.log(totalBalance)
 
  // Mandamos una cantidad loca de ethers para comprobar que funciona. 
  
  // ATENCION NO HACE FALTA FIRMAR LA TRANSACCION POR QUE WEB3 A CONECTADO CON EL NODO DE MANERA DIRECTA Y HA RECUPERADO LAS PRIVADAS
  // EN UNA RED REAL HABRÍA QUE PASAR LA PRIVADA QUE ES LO QUE VA  PASAR EN LOS LOTEROS QUE NO TENEMOS LAS PRIVADAS  
  
  await web3.eth.sendTransaction({
    from: sender,
    to: receiver,
    value: '10000000000000000000'
  })
    
  var totalBalance2 = await web3.eth.getBalance(receiver).then(console.log);
  console.log(totalBalance2)
  
  }
  
  mandaPrueba2(cuentaPrueba.address)
  
 
// Ahora que esta cuenta ya tiene saldo se puede usar junto a su privada para mandar transacciones al contrato (no habria hecho falta hacer todo esto
//  porque didacticamente se podría haber usado una de ganache, pero bueno)
 
// para poder mandar una transaccion con una cuenta de eth de la que se conoce la privada hay que firmar la transaccion:
 
var Tx = require('ethereumjs-tx');
 
// creamos el objeto del envio que queremos generar
 
 
// lo unico un pelin raro es el encodeABI, que 
dataTx = myContract.methods.myfuncion(params).encodeABI(); //The encoded ABI of the method
 
var rawTx = {
  to: ,//a la direccion del contrato (recuperada de loterias)
  data:dataTx 
}
 
// CREO QUE ESTO SI QUEREMOS PUEDE SER UN OBJETO COMO LOS ANTERIORES, (NO ESTOY SEGURO...)
 
// var rawTx = contratoLotero.methods.createLottery().send({
//   from: sender,
//   gasPrice: '20000000000'
// })
 
 
// aqui viene la magia, con la privada se firma la transaccion
var tx = new Tx(rawTx);
tx.sign('yourprivateKey');
 
// se serializa (sin mas, movidas criptograficas)
var serializedTx = tx.serialize();
// y aqui en vez de invocar a la funcion directamente de call() o send() de los metodos de un contratoi
// se invoca a la funcion enviar transaccion firmada que dentro tiene la seralizedTx que dentro tiene el metodo de la funcion
web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
.on('receipt', console.log);
 
// Y YA ESTA!!!!
 
// SI CLARAMENTE ESTO SIN SABER LO QUE SE ESTA HACIENDO ES JODIDO
