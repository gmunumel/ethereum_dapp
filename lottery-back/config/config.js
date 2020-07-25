// config.js

/* eslint-disable max-len */

// TODO: Make your own configuration
module.exports = {
  eth: {
    nodeUrl: 'localhost',
    nodePort: '8545',
    transactionOptions: {
      gas: 6721975,
      gasPrice: 0,
    },
  },
  contracts: {
    LotteryFactory: {
      contractName: 'LotteryFactory',
      contractAddress: '0xCfEB869F69431e42cdB54A4F4f105C19C080A601',
      contractAbi: 
      [
        {
          "constant": false,
          "inputs": [
            {
              "name": "_maxNumberParticipants",
              "type": "uint8"
            },
            {
              "name": "_participationPrice",
              "type": "uint256"
            },
            {
              "name": "_pot",
              "type": "uint256"
            },
            {
              "name": "_prize",
              "type": "uint256"
            }
          ],
          "name": "createLottery",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getLotteries",
          "outputs": [
            {
              "name": "",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
      ],
    },
    Lottery: {
    contractName: 'Lottery',
    contractAbi:[
        {
          "inputs": [
            {
              "name": "_maxNumberParticipants",
              "type": "uint8"
            },
            {
              "name": "_participationPrice",
              "type": "uint256"
            },
            {
              "name": "_pot",
              "type": "uint256"
            },
            {
              "name": "_prize",
              "type": "uint256"
            },
            {
              "name": "_owner",
              "type": "address"
            },
            {
              "name": "_masterContract",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getLottery",
          "outputs": [
            {
              "name": "",
              "type": "uint8"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint256"
            },
            {
              "name": "",
              "type": "uint8"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "addParticipant",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getParticipants",
          "outputs": [
            {
              "name": "",
              "type": "address[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "withdrawParticipation",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [],
          "name": "raffle",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getWinner",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
      ]
},
  }, 
};
