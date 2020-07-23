pragma solidity ^0.4.26; //Lo dice en el video del día 4 a las 2:32:28


/**
 * @title Storage
 * @dev Store & retreive value in a variable
 */
    
contract LotteryFactory {

    address[] private listLotteries; // mapping no deja iterar sobre el. Por lo tanto, va a ser necesario para poder devolver el listado de TODAS las loterias.


    // Creamos loteria
    // Creamos la loteria de prueba y colocamos payable y no payable y funciona en ambos casos, investigar TODO
    function createLottery(uint8 _maxNumberParticipants, uint256 _participationPrice, uint256 _pot, uint256 _prize) public payable {
        require(_prize < _pot);
        require(_maxNumberParticipants > 0);
        require(_participationPrice > 0);
        require(_prize > 0);
        
        address newLottery = new Lottery(_maxNumberParticipants, _participationPrice, _pot, _prize, msg.sender, this);
        listLotteries.push(newLottery);
    }
    
    //Funcion que devuelve el listado de loterias
    function getLotteries() public view returns (address[]){
        return listLotteries;
    }

}

contract Lottery {

    uint8 private maxNumberParticipants;
    uint256 private participationPrice;
    uint256 private pot;
    uint256 private prize;
    address private ownerLottery;
    address private masterContract;
    State private status;

    address[] private listParticipants; // lista de los participantes.
    mapping (address => uint256) private mapParticipants;  // key: address de la participante, y value: el valor de la participacion.
    
    // Estados de la loteria
    enum State{
        Active,
        Failed,
        Finished,
        Terminated
    }
    
    //Constructor
    constructor(uint8 _maxNumberParticipants, uint256 _participationPrice, uint256 _pot, uint256 _prize, address _owner, address _masterContract) public {
        maxNumberParticipants = _maxNumberParticipants;
        participationPrice = _participationPrice;
        pot = _pot;
        ownerLottery = _owner;
        prize = _prize;
        status = State.Active;
        masterContract = _masterContract;
    }
    

    // para hacer un patron de estados
    modifier atState(State _status) {
        require(status == _status, "Estado no permitido para ejecutar la accion");
        _;
    }
    
    //patron ownable
    modifier onlyOwner() {
        require(ownerLottery == msg.sender, "Solo puede realizar el sorteo el dueño del contrato");
        _;
    }
    
 
    //Funcion que devuelve una loteria
    function getLottery() public view  returns (uint8, uint256, uint256, uint256, State){
         return (maxNumberParticipants, participationPrice, pot, prize, status);
    }
    
    // Añadir participante de loteria
    // Se usa el patron de estados
    function addParticipant() public payable atState(State.Active) {
        
        require(mapParticipants[msg.sender] != participationPrice); // el participante no este ya en la loteria
        require(msg.value == participationPrice);                   //verificar que el participante participa con el precio de la loteria

        
        mapParticipants[msg.sender] = participationPrice;
        listParticipants.push(msg.sender);
        
        uint256 potAcumulated = listParticipants.length * participationPrice;
        
        //Si nos pasamos de la recaudacion en el la ultima participación no lo controlamos y se lo queda el lotero. 
        if (potAcumulated >= pot) {
            status = State.Finished;
        } else if (maxNumberParticipants == listParticipants.length) {
            status = State.Failed;
        }
    }
    
    //Devuelve lista de participantes.
    function getParticipants() public view returns (address[]) {
        return listParticipants;
    }
    
    // Withdraw the participation of the lottery
    // Se usa el patron pull over push
    // Se usa el patron check effects iteration
    // Se usa el patron de estados
    function withdrawParticipation() public payable atState(State.Failed){
        //1 - Comprobamos que existe
        require(mapParticipants[msg.sender] == participationPrice);
        
         //2 - Lo ponemos a 0 el valor en el mapping para evitar re-entrancy attacks
        mapParticipants[msg.sender] = 0;
        
        //Enviamos el cash
         msg.sender.transfer(participationPrice);
    }

    
    // Sorteo de loteria.
    // Usamos el patron de estados y el patron ownable
     function raffle() public payable atState(State.Finished) onlyOwner(){

        require(msg.sender == ownerLottery);

        uint8 winner = uint8(random() % listParticipants.length);
        listParticipants[winner].transfer(prize);
      
        ownerLottery.transfer((listParticipants.length * participationPrice) - prize);
        
    
        status = State.Terminated;
     }

    function random() private view returns (uint8) {
       LotteryFactory l = LotteryFactory(masterContract);
       return uint8(keccak256(abi.encodePacked(block.timestamp, block.difficulty, l.getLotteries().length)));
    }
}  

