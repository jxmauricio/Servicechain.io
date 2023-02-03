module.exports = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "waiter",
        "type": "address"
      }
    ],
    "name": "getRating",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "avgRating",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ratings",
    "outputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "rating",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "customer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "waiter",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "rating",
        "type": "uint256"
      }
    ],
    "name": "sendRatings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];