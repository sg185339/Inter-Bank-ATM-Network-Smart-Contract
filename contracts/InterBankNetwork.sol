pragma solidity >=0.5.16;
import "./SafeMath.sol";

contract InterBankNetwork {
    using SafeMath for uint256;
    address payable contractOwner;
    bytes32 name;
    uint256 public constant MIN_FUNDING_AMOUNT = 10 ether;
    uint256 public constant noticePeriod = 90 days;
    mapping(address => bool) public registeredBanks;
    mapping(address => uint256) private bankBalance;
    mapping(address => uint256) private bankfundBalance; 
    mapping(address => uint256) public terminationDayforBanks;
    mapping(address => uint256) public terminationDayforBankbyOwner;
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    enum State { None, Initiated, Confirmed }
    enum TransactionType { Unknown, Deposit, Withdrawal }
    struct Transfer {
        address from;
        address to;
        uint fromAccount;
        uint amount;
        TransactionType txnType;
        State state;
        uint timestamp;
    }
    // hashtable of transfers
    mapping (bytes32 => Transfer) transfers;

    constructor() public{
        contractOwner = msg.sender;
    }   
    
    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    modifier requireIsOperational()
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }
    
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }
    
     modifier requireIsBankRegistered()
    {
        require(registeredBanks[msg.sender], "Bank is not registered");
        _;
    }
	
	modifier requireIssuerRegistered(address bank)
    {
        require(registeredBanks[bank], "Bank is not registered");
        _;
    }
    
        modifier requireAcquirerRegistered(address bank)
    {
        require(registeredBanks[bank], "Bank is not registered");
        _;
    }
    
    
    //***************events are logging events***************************************************
 
    event TransferRequested(address from, address to, bytes32 correlationId, bytes32 transferId);
    event TransferConfirmed(address from, bytes32 transferId);
    event SimpleEvent();
    
    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function setOperatingStatus
                            (
                                bool mode
                            )
                            external
                            requireContractOwner
    {
        operational = mode;
    }
    
        function sendSimpleEvent () public returns (bool) {
        emit SimpleEvent();
        return true;
    }
    
    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    function addBank() public payable requireIsOperational {
    require(msg.value >= MIN_FUNDING_AMOUNT,"Bank cannot be added in this network until funding of 10 ETH");
    registeredBanks[msg.sender] = true;
    uint256 fundedamount = msg.value;
    bankfundBalance[msg.sender] = fundedamount;
    contractOwner.transfer(fundedamount);
    }
    
    function fundBank() public payable requireIsOperational requireIsBankRegistered{
        bankBalance[msg.sender] = bankBalance[msg.sender].add(msg.value);
    }
    
    function terminateNoticeBank() public requireIsBankRegistered requireIsOperational {
        terminationDayforBanks[msg.sender]= now + noticePeriod;
    }
    
    function terminateNoticeBankbyOwner(address bank,uint256 terminationdate) public requireIsOperational requireContractOwner{
        terminationDayforBankbyOwner[bank]= terminationdate;
    }
    
    function getBalance(address bank) public view requireIsOperational requireIsBankRegistered returns(uint256){
        return bankBalance[bank];
    }
    
    function withdrawBank() public requireIsBankRegistered requireIsOperational{
        require((terminationDayforBanks[msg.sender] > 0 || terminationDayforBankbyOwner[msg.sender] > 0),"No notice period served..");
        require((now >= terminationDayforBanks[msg.sender]) || (now >= terminationDayforBankbyOwner[msg.sender]),"You are still in notice period. Can not withdraw.");
        registeredBanks[msg.sender]=false;
        uint withdrawAmount = bankBalance[msg.sender].add(bankfundBalance[msg.sender]);
        bankBalance[msg.sender] = 0;
        bankfundBalance[msg.sender]=0;
        terminationDayforBanks[msg.sender]=0;
        terminationDayforBankbyOwner[msg.sender]=0;
        address payable transferTo = msg.sender;
        transferTo.transfer(withdrawAmount);
    }
    
        // msg.sender (from FI) requests a transfer
    function requestTransfer(bytes32 correlationId, uint fromAccount, address to, uint amount, TransactionType transactionType) requireIssuerRegistered(msg.sender) requireAcquirerRegistered(to) public returns(bytes32){
        
	if (transactionType == TransactionType.Unknown) return 0;
        emit SimpleEvent();
        bytes memory ss = abi.encodePacked(msg.sender,to,fromAccount,amount,now,correlationId);
        bytes32  transferId = sha256(ss);
        Transfer storage  transfer = transfers[transferId];
        
        // make sure it's a new transfer (can we check for defined here?)
        if (transfer.state != State.None) return 0;

        transfer.from           = msg.sender;
        transfer.to             = to;
        transfer.fromAccount    = fromAccount;
        transfer.amount         = amount;
        transfer.txnType	= transactionType;
        transfer.state          = State.Initiated;
        transfer.timestamp	= now;

        // Notify the receiver that the transfer is requested
       emit TransferRequested(msg.sender, to, correlationId, transferId);
	   return(transferId);
    }

    // msg.sender (to FI) confirms a transfer
    function confirmTransfer(bytes32 transferId) public returns (bool) {
        Transfer memory transfer = transfers[transferId];
        if (msg.sender != transfer.to || transfer.state != State.Initiated || transfer.state != State.Confirmed) return false;
        transfer.state = State.Confirmed;
        
        bankBalance[msg.sender] = bankBalance[msg.sender].sub(transfer.amount);       
        bankBalance[transfer.from] = bankBalance[transfer.from].add(transfer.amount) ;
        // notify sender that the transfer is confirmed
        emit TransferConfirmed(transfer.from, transferId);
        return true;
    }

    
	/********************************************************************************************/
    /*                           Getters, only sender, receiver can access                            */
    /********************************************************************************************/
    function getFrom(bytes32 transferId) public view returns (address) {
        Transfer memory transfer = transfers[transferId];
        if (msg.sender != transfer.to && msg.sender != transfer.from) return address(0);
        return transfer.from;
    }
    function getTo(bytes32 transferId) public view returns (address) {
        Transfer memory transfer = transfers[transferId];
        if (msg.sender != transfer.to && msg.sender != transfer.from) return address(0);
        return transfer.to;
    }
    function getFromAccount(bytes32 transferId) public view returns (uint) {
        Transfer memory transfer = transfers[transferId];
        if (msg.sender != transfer.to && msg.sender != transfer.from) return 0;
        return transfer.fromAccount;
    }
    function getAmount(bytes32 transferId) public view returns (uint) {
        Transfer memory transfer = transfers[transferId];
        if (msg.sender != transfer.to && msg.sender != transfer.from) return 0;
        return transfer.amount;
    }
    function getState(bytes32 transferId) public view returns (State) {
        Transfer memory transfer = transfers[transferId];
        if (msg.sender != transfer.to && msg.sender != transfer.from) return State.None;
        return transfer.state;
    }
    function getTransactionType(bytes32 transferId) public view returns (TransactionType) {
        Transfer memory transfer = transfers[transferId];
        if (msg.sender != transfer.to && msg.sender != transfer.from) return TransactionType.Unknown;
        return transfer.txnType;
    }
    function getTimestamp(bytes32 transferId) public view returns (uint) {
        Transfer memory transfer = transfers[transferId];
        if (msg.sender != transfer.to && msg.sender != transfer.from) return 0;
        return transfer.timestamp;
    }
    
}