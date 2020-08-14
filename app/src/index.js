import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/InterBankNetwork.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function () {
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

  setStatus: function (message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function () {
    const { addBank } = this.meta.methods;
    let bank = await addBank().send({
      from: this.account,
      value: 10000000000000000000,
    });
    const status = document.getElementById("bank");
    if (bank == 0) { status.innerHTML = "Bank is not registered yet. Please try again." }
    else { status.innerHTML = "Bank has been registered now." }
  },

  fundBank: async function () {
    const { fundBank } = this.meta.methods;
    const fundamount = document.getElementById("fundamount").value;
    console.log(fundamount);
    await fundBank().send({
      from: this.account,
      value: fundamount,
    });
    const status = document.getElementById("balance");
    status.innerHTML = 'The Bank has been funded now with ' + fundamount + ' wei';
  },

  terminateNoticeBank: async function () {
    const { terminateNoticeBank } = this.meta.methods;
    await terminateNoticeBank().send({
      from: this.account,
    });
  },

  withdrawBank: async function () {
    const { withdrawBank } = this.meta.methods;
    await withdrawBank().send({
      from: this.account,
    });
  },
  getBalance: async function () {
    const { getBalance } = this.meta.methods;
    const status = document.getElementById("balance");
    status.innerHTML = await getBalance().call({
      from: this.account,
    });
  },


  // Implement Task 4 Modify the front end of the DAPP
  requestTransfer: async function () {
    const { requestTransfer } = this.meta.methods;
    const Correlation = document.getElementById("Correlation").value;
    const Customer = document.getElementById("Customer").value;
    const Address = document.getElementById("Address").value;
    const Amount = document.getElementById("Amount").value;
    const Transaction = document.getElementById("RTransaction").value;
    console.log(Transaction)
    let tid = await requestTransfer(Correlation, Customer, Address, Amount, Transaction).send({
      from: this.account,
    });
    const transferidelement = document.getElementById("transferid");
    this.meta.events.TransferRequested({ fromBlock: 0 }, function (error, event) { console.log(error) })
      .on('data', (log) => {
        let { returnValues: { from, to, correlationId, transferId }, blockNumber } = log
        console.log(`transferId = ${transferId}`)
        transferidelement.innerHTML = `The transaction has been initiated with transfer id :- ${transferId}`;
      })
      .on('changed', (log) => {
        console.log(`Changed: ${log}`)
      })
      .on('error', (log) => {
        console.log(`error:  ${log}`)
      })
    
    
  },

  confirmTransfer: async function () {
    const { confirmTransfer } = this.meta.methods;
    const Transaction = document.getElementById("Transaction").value;
    await confirmTransfer(Transaction).send({
      from: this.account,
    });
    const status2 = document.getElementById("status2");
    this.meta.events.TransferConfirmed({ fromBlock: 0 }, function (error, event){})
      .on('data', (log) => {
        let { returnValues: { from, transferId }, blockNumber } = log
        console.log(`transferId = ${transferId}`)
        status2.innerHTML = `Transaction ${transferId} is confirmed now `;
      })
      .on('changed', (log) => {
        console.log(`Changed: ${log}`)
      })
      .on('error', (log) => {
        console.log(`error:  ${log}`)
      })
  },

  getFrom: async function () {
    const { getFrom } = this.meta.methods;
    const Transaction = document.getElementById("Transaction").value;
    const status = document.getElementById("view");
    status.innerHTML = await getFrom(Transaction).call({
      from: this.account,
    });
  },

  getTo: async function () {
    const { getTo } = this.meta.methods;
    const Transaction = document.getElementById("Transaction").value;
    const status = document.getElementById("view");
    status.innerHTML = await getTo(Transaction).call({
      from: this.account,
    });
  },

  getFromAccount: async function () {
    const { getFromAccount } = this.meta.methods;
    const Transaction = document.getElementById("Transaction").value;
    const status = document.getElementById("view");
    status.innerHTML = await getFromAccount(Transaction).call({
      from: this.account,
    });
  },

  getAmount: async function () {
    const { getAmount } = this.meta.methods;
    const Transaction = document.getElementById("Transaction").value;
    const status = document.getElementById("view");
    status.innerHTML = await getAmount(Transaction).call({
      from: this.account,
    }) + " wei";
  },

  getState: async function () {
    const { getState } = this.meta.methods;
    const Transaction = document.getElementById("Transaction").value;
    const status = document.getElementById("view");
    let state = await getState(Transaction).call({
      from: this.account,
    });
    if (state == 0) { status.innerHTML = 'None'; }
    else if (state = 1) { status.innerHTML = 'Initiated'; }
    else { status.innerHTML = 'Confirmed'; }
  }

};

window.App = App;

window.addEventListener("load", async function () {
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

