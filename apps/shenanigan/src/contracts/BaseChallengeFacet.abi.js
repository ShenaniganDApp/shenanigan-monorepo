module.exports = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum Status",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "ChallengeResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "athlete",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "challengeUrl",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "jsonUrl",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "teamCount",
        "type": "uint256"
      }
    ],
    "name": "CreateChallenge",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "challengeUrl",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "donator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "name": "Donate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "challengeUrl",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "challenger",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "challengeUrl",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "newBasePrice",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "challengeUrl",
        "type": "string"
      }
    ],
    "name": "baseChallengeInfoByChallengeUrl",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "athlete",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "jsonUrl",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "challengeUrl",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "teamCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "basePrice",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
              }
            ],
            "internalType": "struct Counters.Counter",
            "name": "basePriceNonce",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "limit",
            "type": "uint256"
          },
          {
            "internalType": "enum Status",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "donatedFunds",
            "type": "uint256"
          }
        ],
        "internalType": "struct BaseChallenge",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "baseChallengeInfoById",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "athlete",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "jsonUrl",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "challengeUrl",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "teamCount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "basePrice",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
              }
            ],
            "internalType": "struct Counters.Counter",
            "name": "basePriceNonce",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "limit",
            "type": "uint256"
          },
          {
            "internalType": "enum Status",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "donatedFunds",
            "type": "uint256"
          }
        ],
        "internalType": "struct BaseChallenge",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "signedHash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "checkAddress",
        "type": "address"
      }
    ],
    "name": "checkSignature",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "checkSignatureFlag",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_challengeUrl",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_jsonUrl",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_teamCount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_limit",
        "type": "uint256"
      }
    ],
    "name": "createChallenge",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_challengeUrl",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_donationAmount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_depositToken",
        "type": "address"
      }
    ],
    "name": "donate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "signedHash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "getSigner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTrustedForwarder",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "forwarder",
        "type": "address"
      }
    ],
    "name": "isTrustedForwarder",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_challengeUrl",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_resolution",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "resolveChallenge",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_take",
        "type": "uint256"
      }
    ],
    "name": "setAthleteTake",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_address",
        "type": "address"
      }
    ],
    "name": "setChallengeRegistry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "newFlag",
        "type": "bool"
      }
    ],
    "name": "setCheckSignatureFlag",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "challengeUrl",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "setPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "challengeUrl",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "setPriceFromSignature",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_trustedForwarder",
        "type": "address"
      }
    ],
    "name": "setTrustedForwarder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "trustedForwarder",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "versionRecipient",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_challengeUrl",
        "type": "string"
      },
      {
        "internalType": "address[]",
        "name": "_tokenAddresses",
        "type": "address[]"
      }
    ],
    "name": "withdrawBalance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_challengeUrl",
        "type": "string"
      },
      {
        "internalType": "address[]",
        "name": "_tokenAddresses",
        "type": "address[]"
      }
    ],
    "name": "withdrawDonation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];