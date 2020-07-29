# Inter-Bank-ATM-Network-Smart-Contract
Currently, Inter-Bank ATM process works as a Remote-On-Us model where third party network or mediator operates in between banks to transfer funds from one to another and charges fees for this which is further charged to customer only.
Using a blockchain with all the members of the network on the blockchain as nodes can help to decomplexify the whole system. The transactions done on the ATM can be recorded on the blockchain and smart contract can work between the issuer and acquirer bank directly without involving the mediator. This will help to enhance security, transparency and immutability of the data as there will be no loss of online transactions data. The reconciliation process will also be simplified because of implementation of the blockchain. This will reduce the transaction charges and the costs of reconciliation.

Suppose, there is a person XYZ who has a savings account with bank A, wants to withdraw the money from bank B's ATM. Bank A will debit the transaction value and charge from XYZ's account and will credit it to their settlement account. Bank C (mediator) will debit the Bank A's settlement account with transaction value and accumulated fee and will credit it accordingly to the Bank B's settlement account.

When a blockchain is implemented in Inter-Bank ATM network, Bank A will directly send money to Bank B without involving the Bank C(mediator).

# Contract is deployed on Rinkeby (Ethereum-Testnet) Network.
## Contract Address :- 0x65Ac627dD5973d087028be8a585EA3Eb0Fb8763d
## Contract URL :- https://rinkeby.etherscan.io/address/0x65Ac627dD5973d087028be8a585EA3Eb0Fb8763d
### For now, we have focused on the settlement of the money. Authentication and Validation will be done in further phases.

We have built DApp as well to interact with the contract.

This involves a number of open source projects to work properly:

* [Remix] - Solidity IDE that's used to write, compile and debug Solidity code.
* [Javascript] - ightweight, interpreted, object-oriented language with first-class functions, and is best known as the scripting language for Web pages | One Word- Awesome.
* [Solidity] - A contract-oriented programming language for writing smart contracts.
* [Truffle] - A Development environment, testing framework, and asset pipeline all rolled into one.
* [MetaMask] - An extension injects the Ethereum web3 API into every website's javascript context, so that dapps can read from the blockchain.

#### Installation - Frontend
Install the dependencies and devDependencies and start the server.

```sh
$ npm install 
$ cd app/js
$ npm run dev
```
#### Installation - Backend
You do not need to do anything. Contract is already deployed on Blockchain...
