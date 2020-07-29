# Inter-Bank-ATM-Network-Smart-Contract

## Background

When a client pays a bill or sends money from one bank to another, it takes 2-5 days to process. This is because money is not sent in real-time, but transactions relative to another financial institution (FI) are summed and processed as a batch at the end of the day. A EFT smart contract solves this problem by sharing a ledger between all concerned FIs--a consortium blockchain. Any FI that is part of the consortium and enters into the smart contract sends the EFT transaction on the shared ledger in real-time and does not require a third party to clear and settle the inter-bank transactions.

## Smart Contract in Solidity

The smart contract may or may not be designed to use Ethereum's cryptocurrency (ETH), or to link Canadian Dollars (CAD) to ETH. We make use of only the shared ledger that records the inter-bank transactions and the ability of FIs to consent in a smart contract to a deposit or withdrawal on behalf of the customer's bank account to the other FI's customer's bank account. Here is an example use case.

### 1. Request transfer

Bank A executes `requestTransfer` with a chosen `correlationId`, `fromAccount` = 12345 (bank account number at Bank A), `address` = <blockchain address of Bank B>, `amount` = 1000 (CAD), and `transactionType` = `Deposit`. The function generates a `transferID` by hashing the combination of the blockchain address of Bank A, the blockchain address of Bank B, bank account 12345 at Bank A, the amount, the timestamp of the blockchain transaction, and the correlationId.
```
  bytes32 transferId = sha256(msg.sender, to, fromAccount, toAccount, amount, now, correlationId);
```
The values are populated and the transfer's `State` is set to `Initiated`. A `TransferRequested` event is recorded on the blockchain with Bank A's blockchain address, Bank B's blockchain address, the correlation ID, and the transfer ID.
Hashing is used to simulate a universally-unique identifier (UUID).
  
### 2. Get details of transfer request

Bank B can call getters like `getFromAccount(bytes32 transferId) returns (uint)` and `getAmount(bytes32 transferId) returns (uint)` to get details of the transfer request. The smart contract's getters allow only the sender and receiver to access these confidential details by checking that the blockchain address of the entity requesting the details corresponds to the sender or receiver's blockchain address for the transfer request.

### 3. Confirm transfer

Bank B executes `confirmTransfer` with the `transferId`. The function checks that the blockchain address matches the intended receiver, and changes the `Transfer`'s state to `Confirmed`. A `TransferConfirmed` event is posted on the blockchain, notifying the sender.

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
