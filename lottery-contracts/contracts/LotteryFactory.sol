
pragma solidity ^0.4.26; //Lo dice en el video del día 4 a las 2:32:28 solidity ^0.4.26; //Lo dice en el video del día 4 a las 2:32:28


/// @title Factoria de loterias
/// @author Javier Eguren Mateo  
///         Sergio Cañil Montero             
///         Ana Cristina Llera Amieva 
///         Jorge Chamorro Rodríguez 
///         Gabriel David Muñumel Mesa 
///         Alfonso Martínez-Almeida Riol 
/// @notice Contrato que se encarga de crear loterias y almacenarlas
/// @dev Las loterias que se van creando se van almacenando en un array de direcciones
contract LotteryFactory {

    /// Alamcena las loterias que se van creando
    address[] private listLotteries; 


    /// @notice Crea loterias con los parametros indicados
    /// @dev La direccion de la loteria creada la vamos a ir guardando en un array
    /// @param _maxNumberParticipants Nunmero maximo de participantes que puede tener una loteria
    /// @param _participationPrice Precio de la participacion de la loteria
    /// @param _pot Bote a recaudar de la loteria
    /// @param _prize Premio de la loteria
    function createLottery(uint8 _maxNumberParticipants, uint256 _participationPrice, uint256 _pot, uint256 _prize) public payable {
        require(_prize < _pot);
        require(_maxNumberParticipants > 0);
        require(_participationPrice > 0);
        require(_prize > 0);
        
        address newLottery = new Lottery(_maxNumberParticipants, _participationPrice, _pot, _prize, msg.sender, this);
        listLotteries.push(newLottery);
    }
    

    /// @notice Devuelve la lista de las loterias creadas
    /// @return array de direcciones de las loterias creadas
    function getLotteries() public view returns (address[]){
        return listLotteries;
    }

}

/// @title Loteria creada
/// @author Javier Eguren Mateo  
///         Sergio Cañil Montero             
///         Ana Cristina Llera Amieva 
///         Jorge Chamorro Rodríguez 
///         Gabriel David Muñumel Mesa 
///         Alfonso Martínez-Almeida Riol 
/// @notice Contrato que se encarga de la manipulacion de una loteria
/// @dev Las loterias que se van creando se van almacenando en un array de direcciones
contract Lottery {

    /// maximo numero de participantes en la loteria
    uint8 private maxNumberParticipants;
    /// precio de la participaciond e la loteria
    uint256 private participationPrice;
    /// precio del bote a recaudar de la loteria
    uint256 private pot;
    /// premio de la loteria
    uint256 private prize;
    /// direccion del creador de la loteria
    address private ownerLottery;
    /// direccion del contrato LotteryFactory
    address private masterContract;
    /// estado en el que se encuentra una loteria. Los posibles estados son los que contienen el enum State
    State private status;
    /// el ganador final de la loteria
    address private winner;

    /// Lista de direcciones de los participantes
    address[] private listParticipants;
    /// mapping de los participantes de una loteria. Contiene:  key: address de la participante, y value: el valor de la participacion.
    mapping (address => uint256) private mapParticipants;
    
    /// Estados en los que puede estar una loteria
    enum State{
        Active,
        Failed,
        Finished,
        Terminated
    }
    
    /// @notice Constructor de la loteria. Crea loterias con los parametros indicados
    /// @param _maxNumberParticipants Numero maximo de participantes que puede tener una loteria
    /// @param _participationPrice Precio de la participacion de la loteria
    /// @param _pot Bote a recaudar de la loteria
    /// @param _prize Premio de la loteria
    /// @param _owner Direccion del creador de la loteria
    /// @param _masterContract Direccion del contrato LotteryFactory
    constructor(uint8 _maxNumberParticipants, uint256 _participationPrice, uint256 _pot, uint256 _prize, address _owner, address _masterContract) public {
        maxNumberParticipants = _maxNumberParticipants;
        participationPrice = _participationPrice;
        pot = _pot;
        ownerLottery = _owner;
        prize = _prize;
        status = State.Active;
        masterContract = _masterContract;
    }
    

    /// modificador para hacer un patron de estados
    modifier atState(State _status) {
        require(status == _status, "Estado no permitido para ejecutar la accion");
        _;
    }
    
    ///patron ownable. No hace falta. Al solo usarse en el sorteo metemos ahi el required
    ///modifier onlyOwner() {
    ///    require(ownerLottery == msg.sender, "Solo puede realizar el sorteo el dueño del contrato");
    ///    _;
    ///}
    
    

    /// @notice Devuelve los valores que tiene la lotería que llama a la función.
    /// @return Numero maximo de participantes que puede tener una loteria
    /// @return Precio de la participacion de la loteria
    /// @return Bote a recaudar de la loteria
    /// @return Premio de la loteria
    /// @return Estado en el que se encuentra la loteria
    function getLottery() public view  returns (uint8, uint256, uint256, uint256, State){
         return (maxNumberParticipants, participationPrice, pot, prize, status);
    }
    
    /// @notice Añade participantes a la loteria
    function addParticipant() public payable atState(State.Active) {
        
        /// Comprobamos que el participante no este ya en la loteria
        require(mapParticipants[msg.sender] != participationPrice);
        /// Comprobamos que el participante participa con el precio de la loteria
        require(msg.value == participationPrice);

        ///Añadimos al mapping y al array las direcciones de los participantes.
        mapParticipants[msg.sender] = participationPrice;
        listParticipants.push(msg.sender);
        
        ///Calculamos el bote que llevamos acumulado
        uint256 potAcumulated = listParticipants.length * participationPrice;
        
        /// Si nos pasamos de la recaudacion en el la ultima participación se lo queda el lotero y dejamos la loteria en estado Finished
        if (potAcumulated >= pot) {
            status = State.Finished;
        } else if (maxNumberParticipants == listParticipants.length) {
             /// si llegamos a este punto es porque hemos llegado al maximo de participantes y no hemos llegado al bote necesario.
             ///Dejamos la loteria en estado Failed
            status = State.Failed;
        }
    }
    
    /// @notice Devuelve la lista de participantes
    /// @return array de direcciones de los participantes
    function getParticipants() public view returns (address[]) {
        return listParticipants;
    }
    
    /// @notice Reembolsa la participacion a un participante cuando la loteria esta en estado Failed
    /// @dev Es el participante quien solicita y ejecuta el reembolso
    function withdrawParticipation() public payable atState(State.Failed){
        /// Comprobamos que existe el participante y que tiene el valor de la participacion en el mapping
        require(mapParticipants[msg.sender] == participationPrice);
        
         /// Ponemos el valor del mapping a 0
        mapParticipants[msg.sender] = 0;
        
        /// Enviamos la participacion al emisor de la transaccion que es el participante
        msg.sender.transfer(participationPrice);
    }

    
    /// @notice Sorteo de la loteria
    /// @dev Solo el creador de la loteria puede realizar el sorteo
    function raffle() public payable atState(State.Finished) {

        /// Comprobamos que es el creador de la loteria quien intenta realizar el sorteo
        require(msg.sender == ownerLottery, "Solo puede realizar el sorteo el dueño del contrato");

        /// realizamos el sorteo
        uint8 winnerRaffle = uint8(random() % listParticipants.length);
        /// Guardamos el ganador
        winner = listParticipants[winnerRaffle];
        /// Pagamos el premio al ganador
        winner.transfer(prize);
        /// El lotero se queda la parte restante. La resta del bote - el premio
        ownerLottery.transfer((listParticipants.length * participationPrice) - prize);
        /// Ponemos el estado de la loteria a terminado
        status = State.Terminated;
    }

    /// @notice Devuelve al ganador de la loteria. 
    /// @dev Se hace asi porque si no en web3 del method.send (de raffle) no podemos recuperar con return
    /// @return el address del gnador
    function getWinner() public view returns (address){
        return winner;
    }


    /// @notice Genera un numero cuasi aleatorio
    /// @dev Vamos a generar un numero cuasi aleatorio para realizar el sorteo de la loteria
    /// @return Numero aleatorio
    function random() private view returns (uint8) {
       LotteryFactory l = LotteryFactory(masterContract);
       /// Para generar el numero, usamos los parametros del sistema timestamp y block.dificulty, 
       ///asi como el numero de las loterias que hay creadas en el sistema
       return uint8(keccak256(abi.encodePacked(block.timestamp, block.difficulty, l.getLotteries().length)));
    }
}  




/// @title Factoria de loterias
/// @author Javier Eguren Mateo  
///         Sergio Cañil Montero             
///         Ana Cristina Llera Amieva 
///         Jorge Chamorro Rodríguez 
///         Gabriel David Muñumel Mesa 
///         Alfonso Martínez-Almeida Riol 
/// @notice Contrato que se encarga de crear loterias y almacenarlas
/// @dev Las loterias que se van creando se van almacenando en un array de direcciones
contract LotteryFactory {

    /// Alamcena las loterias que se van creando
    address[] private listLotteries; 


    /// @notice Crea loterias con los parametros indicados
    /// @dev La direccion de la loteria creada la vamos a ir guardando en un array
    /// @param _maxNumberParticipants Numero maximo de participantes que puede tener una loteria
    /// @param _participationPrice Precio de la participacion de la loteria
    /// @param _pot Bote a recaudar de la loteria
    /// @param _prize Premio de la loteria
    function createLottery(uint8 _maxNumberParticipants, uint256 _participationPrice, uint256 _pot, uint256 _prize) public payable {
        require(_prize < _pot);
        require(_maxNumberParticipants > 0);
        require(_participationPrice > 0);
        require(_prize > 0);
        
        address newLottery = new Lottery(_maxNumberParticipants, _participationPrice, _pot, _prize, msg.sender, this);
        listLotteries.push(newLottery);
    }
    

    /// @notice Devuelve la lista de las loterias creadas
    /// @return array de direcciones de las loterias creadas
    function getLotteries() public view returns (address[]){
        return listLotteries;
    }

}

/// @title Loteria creada
/// @author Javier Eguren Mateo  
///         Sergio Cañil Montero             
///         Ana Cristina Llera Amieva 
///         Jorge Chamorro Rodríguez 
///         Gabriel David Muñumel Mesa 
///         Alfonso Martínez-Almeida Riol 
/// @notice Contrato que se encarga de la manipulacion de una loteria
/// @dev Las loterias que se van creando se van almacenando en un array de direcciones
contract Lottery {

    /// maximo numero de participantes en la loteria
    uint8 private maxNumberParticipants;
    /// precio de la participacion de la loteria
    uint256 private participationPrice;
    /// precio del bote a recaudar de la loteria
    uint256 private pot;
    /// premio de la loteria
    uint256 private prize;
    /// direccion del creador de la loteria
    address private ownerLottery;
    /// direccion del contrato LotteryFactory
    address private masterContract;
    /// estado en el que se encuentra una loteria. Los posibles estados son los que contienen el enum State
    State private status;
    /// el ganador final de la loteria
    address private winner;

    /// Lista de direcciones de los participantes
    address[] private listParticipants;
    /// mapping de los participantes de una loteria. Contiene:  key: address de la participante, y value: el valor de la participacion.
    mapping (address => uint256) private mapParticipants;
    
    /// Estados en los que puede estar una loteria
    enum State{
        Active,
        Failed,
        Finished,
        Terminated
    }
    
    /// @notice Constructor de la loteria. Crea loterias con los parametros indicados
    /// @param _maxNumberParticipants Numero maximo de participantes que puede tener una loteria
    /// @param _participationPrice Precio de la participacion de la loteria
    /// @param _pot Bote a recaudar de la loteria
    /// @param _prize Premio de la loteria
    /// @param _owner Direccion del creador de la loteria
    /// @param _masterContract Direccion del contrato LotteryFactory
    constructor(uint8 _maxNumberParticipants, uint256 _participationPrice, uint256 _pot, uint256 _prize, address _owner, address _masterContract) public {
        maxNumberParticipants = _maxNumberParticipants;
        participationPrice = _participationPrice;
        pot = _pot;
        ownerLottery = _owner;
        prize = _prize;
        status = State.Active;
        masterContract = _masterContract;
    }
    

    /// modificador para hacer un patron de estados
    modifier atState(State _status) {
        require(status == _status, "Estado no permitido para ejecutar la accion");
        _;
    }
    
    ///patron ownable. No hace falta. Al solo usarse en el sorteo metemos ahi el required
    ///modifier onlyOwner() {
    ///    require(ownerLottery == msg.sender, "Solo puede realizar el sorteo el dueño del contrato");
    ///    _;
    ///}
    
    

    /// @notice Devuelve los valores que tiene la lotería que llama a la función.
    /// @return Numero maximo de participantes que puede tener una loteria
    /// @return Precio de la participacion de la loteria
    /// @return Bote a recaudar de la loteria
    /// @return Premio de la loteria
    /// @return Estado en el que se encuentra la loteria
    function getLottery() public view  returns (uint8, uint256, uint256, uint256, State){
         return (maxNumberParticipants, participationPrice, pot, prize, status);
    }
    
    /// @notice Añade participantes a la loteria
    function addParticipant() public payable atState(State.Active) {
        
        /// Comprobamos que el participante no este ya en la loteria
        require(mapParticipants[msg.sender] != participationPrice);
        /// Comprobamos que el participante participa con el precio de la loteria
        require(msg.value == participationPrice);

        /// Añadimos al mapping y al array las direcciones de los participantes.
        mapParticipants[msg.sender] = participationPrice;
        listParticipants.push(msg.sender);
        
        /// Calculamos el bote que llevamos acumulado
        uint256 potAcumulated = listParticipants.length * participationPrice;
        
        /// Si nos pasamos de la recaudacion en la ultima participación se lo queda el lotero y dejamos la loteria en estado Finished
        if (potAcumulated >= pot) {
            status = State.Finished;
        } else if (maxNumberParticipants == listParticipants.length) {
             /// si llegamos a este punto es porque hemos llegado al maximo de participantes y no hemos llegado al bote necesario.
             /// Dejamos la loteria en estado Failed
            status = State.Failed;
        }
    }
    
    /// @notice Devuelve la lista de participantes
    /// @return array de direcciones de los participantes
    function getParticipants() public view returns (address[]) {
        return listParticipants;
    }
    
    /// @notice Reembolsa la participacion a un participante cuando la loteria esta en estado Failed
    /// @dev Es el participante quien solicita y ejecuta el reembolso
    function withdrawParticipation() public payable atState(State.Failed){
        /// Comprobamos que existe el participante y que tiene el valor de la participacion en el mapping
        require(mapParticipants[msg.sender] == participationPrice);
        
         /// Ponemos el valor del mapping a 0
        mapParticipants[msg.sender] = 0;
        
        /// Enviamos la participacion al emisor de la transaccion que es el participante
        msg.sender.transfer(participationPrice);
    }

    
    /// @notice Sorteo de la loteria
    /// @dev Solo el creador de la loteria puede realizar el sorteo
    function raffle() public payable atState(State.Finished) {

        /// Comprobamos que es el creador de la loteria quien intenta realizar el sorteo
        require(msg.sender == ownerLottery, "Solo puede realizar el sorteo el dueño del contrato");

        /// realizamos el sorteo
        uint8 winnerRaffle = uint8(random() % listParticipants.length);
        /// Guardamos el ganador
        winner = listParticipants[winnerRaffle];
        /// Pagamos el premio al ganador
        winner.transfer(prize);
        /// El lotero se queda la parte restante. La resta del bote - el premio
        ownerLottery.transfer((listParticipants.length * participationPrice) - prize);
        /// Ponemos el estado de la loteria a terminado
        status = State.Terminated;
    }

    /// @notice Devuelve al ganador de la loteria. 
    /// @dev Se hace asi porque si no en web3 del method.send (de raffle) no podemos recuperar con return
    /// @return el address del ganador
    function getWinner() public view returns (address){
        return winner;
    }


    /// @notice Genera un numero cuasi aleatorio
    /// @dev Vamos a generar un numero cuasi aleatorio para realizar el sorteo de la loteria
    /// @return Numero aleatorio
    function random() private view returns (uint8) {
       LotteryFactory l = LotteryFactory(masterContract);
       /// Para generar el numero, usamos los parametros del sistema timestamp y block.dificulty, 
       /// asi como el numero de las loterias que hay creadas en el sistema
       return uint8(keccak256(abi.encodePacked(block.timestamp, block.difficulty, l.getLotteries().length)));
    }
}  


