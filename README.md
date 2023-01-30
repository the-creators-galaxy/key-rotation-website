# Hedera Acocunt Key Rotation Website Tool

This tool orchestrates updating of multi-party multi-key signing requirements for an Hedera account such as a DAO or corporate treasury.

## Disclaimer

This is an *experimental* proof of concept project, the creators make no assertion of future maintanance or support.  It has not been audited. *Use at your own risk.*

This software relies on a [Hashpool](https://github.com/the-creators-galaxy/hashpool) instance for submitting transactions to the hedera network via native gRPC.  You may deploy your own instance or use a publicly available one.

Additionally to use this software you must have a third party wallet or key signing tool that is capable of recognizing and signing hedera transactions.  Two such examples of this software are:

* [Hashgraph Signing Tool](https://apps.microsoft.com/store/detail/hashgraph-signing-tool/9PPB258CD9P7) for Windows ([GitHub](https://github.com/bugbytesinc/Hashgraph-Signing-Tool))
* Portable Hashgraph Transaction Signing Tool ([GitHub](https://github.com/bugbytesinc/hashgraph-transaction-signing-tool))


## Technologies

- [TypeScript](https://www.typescriptlang.org)
- [Node.js](https://nodejs.org/en/)
- [HAPI Utility Packages](https://github.com/bugbytesinc/hapi-proto)
- [Vue.js](https://vuejs.org/)

## Getting started

### Installation

1. `git clone https://github.com/the-creators-galaxy/key-rotation-website.git`
2. `cd key-rotation-website`
3. `npm install`

### Running the project

1. `cp sample.env .env`
1. `npm run dev`
2. Navigate a web browser to the URL indicated in the console window.

The environmental property `VITE_API_HASHPOOL_URL`
instructs the website on which [Hashpool](https://github.com/the-creators-galaxy/hashpool) REST Server
to connect to when subbmitting transactions.

## How it works

Upon loading, the site connects to the hashpool server to retrieve 
information regarding the Hedera network to connect to, including a mirror 
node.  After entering an account number, the tool fetches the current key 
requirements for display and provides a user interface to edit the key 
requirements for that account.  Upon satisfactory editing, the site creates 
the necessary hedera transaction, prompts the user for the necessary 
signatures, then submits the signed transaction to the hashpool to forward 
to the gossip network.  It then displays the results of the key rotation 
attempt after the request is processed by the network. 
