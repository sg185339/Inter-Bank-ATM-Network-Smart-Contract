import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/InterBankNetwork.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      console.log(accounts)
      this.account = accounts[0];
      console.log(this.account)
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function() {
    const { addBank } = this.meta.methods;
    await addBank().send({
      from: this.account,
      value: 10000000000000000000,
    });
  },

  terminateNoticeBank: async function() {
    const { terminateNoticeBank } = this.meta.methods;
    await terminateNoticeBank().send({
      from: this.account,
    });
  },

  withdrawBank: async function() {
    const { withdrawBank } = this.meta.methods;
    await withdrawBank().send({
      from: this.account,
    });
  },
  getBalance: async function() {
    const { getBalance } = this.meta.methods;
    const status = document.getElementById("balance");
    console.log( await getBalance(this.account).send({
      from: this.account,
    }));
  },
  

  // Implement Task 4 Modify the front end of the DAPP
  requestTransfer: async function (){
    const { requestTransfer } = this.meta.methods;
    const Correlation = document.getElementById("Correlation").value;
    const Customer = document.getElementById("Customer").value;
    const Address = document.getElementById("Address").value;
    const Amount = document.getElementById("Amount").value;
    const Transaction = document.getElementById("Transaction").value;
    await requestTransfer(Correlation,Customer,Address,Amount,Transaction).call();
  },

  confirmTransfer: async function (){
    const { confirmTransfer } = this.meta.methods;
    const Transaction = document.getElementById("Transaction").value;
    await confirmTransfer(Transaction).call();
  },

  getFrom: async function (){
    const { getFrom } = this.meta.methods;
    const Transaction = document.getElementById("Transaction").value;
    const status = document.getElementById("view");
    status.innerHTML = await getFrom(Transaction).call();
  },

  getTo: async function (){
    const { getTo } = this.meta.methods;
    const Transaction = document.getElementById("Transaction").value;
    const status = document.getElementById("view");
    status.innerHTML = await getTo(Transaction).call();
  },

  getFromAccount: async function (){
    const { getFromAccount } = this.meta.methods;
    const Transaction = document.getElementById("Transaction").value;
    const status = document.getElementById("view");
    status.innerHTML = await getFromAccount(Transaction).call();
  },

  getAmount: async function (){
    const { getAmount } = this.meta.methods;
    const Transaction = document.getElementById("Transaction").value;
    const status = document.getElementById("view");
    status.innerHTML = await getAmount(Transaction).call();
  },

  getState: async function (){
    const { getState } = this.meta.methods;
    const Transaction = document.getElementById("Transaction").value;
    const status = document.getElementById("view");
    status.innerHTML = await getState(Transaction).call();
  }

};

window.App = App;

window.addEventListener("load", async function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
});

