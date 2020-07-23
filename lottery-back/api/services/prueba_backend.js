//SE EJECUTA GANACHE-CLI EN BACKGROUND:
 
 
//Cargamos paquetes de ganache  y web3,
//Se instala con npm en el lottery contracts web3. (estaba en el lottery back (viceversa valdria, ganache en back))
//const ganache = require("ganache-cli");
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
 
//Guardamos para la prueba la publica y privada generada
/*
  address: '0xff45C14342d1F4f4b0FFf1678Dd47E09E03ef1cC',
  privateKey: '0xf4246c152c102cd0546e381c798671af134f32d84be5116496bd9bd253ec96ac',
*/
 
//Ahora si hacemos la prueba de mandar dinero de una cuenta a otra:
 
//CUIDADO LLAMADA ASINCRONA
 
// Mandamos una cantidad loca de ethers para comprobar que funciona. 
 
// ATENCION NO HACE FALTA FIRMAR LA TRANSACCION POR QUE WEB3 A CONECTADO CON EL NODO DE MANERA DIRECTA Y HA RECUPERADO LAS PRIVADAS
// EN UNA RED REAL HABRÍA QUE PASAR LA PRIVADA QUE ES LO QUE VA  PASAR EN LOS LOTEROS QUE NO TENEMOS LAS PRIVADAS  
 
 
 
 
// LLEGADOS A ESTE PUNTO ES MUY SENCILLO YA HACER CUALQUIER INTERACCION:
 
// CREAR UN CONTRATO NUEVO:
//HAY PARAMETROS QUE SE DEFINEN EN LOTTERYBACK/CONFIG
 
 
 
// y ya con el contrato desplegado interactuamos con las funciones_
 
 
// Si la cuenta que se va a usar es una aleatoria (es decir una que un usuario de eth tiene) entonces se complica, 
// ya que hay que pasar la cuenta y la privada ( que es como dijo el profesor en el enunciado, a menos que obligasemos a inyectar metamask en web3)
 
// Para este ejercicio: Creamos una cuenta y transferimos eths
 
 
async function mandaPrueba2() {
  const accounts = await web3.eth.getAccounts()
  
  //Definimos sender y receiver
  const sender = accounts[2];
    
  var totalBalance2 = await web3.eth.getBalance(sender);
  console.log(totalBalance2)
  
  }

mandaPrueba2();
  
 
 
 
 
 


