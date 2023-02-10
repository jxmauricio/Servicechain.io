pragma solidity ^0.8.17;

contract Factory{
    address[] public deployedServices;
    string[] public deployedOrgNames;
    mapping(address=>string) public orgNames;
    function createService( string calldata org) public {
        Service newService = new Service(msg.sender,org);
        deployedOrgNames.push(org);
        deployedServices.push(address(newService));
        orgNames[address(newService)] = org;
    }

    function getDeployedServices() public view returns(address[] memory){
        return deployedServices;
    }

}

contract Service{

    struct customerRating{
        address from;
        uint rating;
    }
    
    struct Transaction {
        address to;
        uint value;
        bytes data;
    }
    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTip(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value,
        bytes data
    );


    Transaction[] public transactions;
    mapping(address=>uint[]) public hourLog;
    mapping(address=>customerRating[]) public ratings;
    string public org;
    address public creator;


    constructor(address creator, string memory org) {
        creator = creator;
        org = org;
    }
//Logging
    function enterHours(uint value) public{
        hourLog[msg.sender].push(value);
    }
    function getTotalHours(address waiter) public view returns(uint vals){
        uint sum = 0;
        for(uint i=0;i<hourLog[waiter].length;i++){
            sum+=hourLog[waiter][i];
        }
        return sum;
    }
    function getHourLog(address waiter) public view returns(uint[] memory){
        return hourLog[waiter];

    }

//Rating
    function sendRatings(address customer,address waiter,uint rating) public {
        ratings[waiter].push(customerRating(customer,rating));
    }

    function getRating(address waiter) public view returns (uint avgRating) {
        uint sumRatings = 0;
        for (uint i=0;i<ratings[waiter].length;i++){
            sumRatings+=ratings[waiter][i].rating;
        }
        uint avgRating = sumRatings/ratings[waiter].length;
        return avgRating;


    }


    
    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    receive() payable external {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function submitTip(address _to, uint _value, bytes memory _data)
        public
    {
        uint txIndex = transactions.length;
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data
        }));
        
        emit SubmitTip(msg.sender, txIndex, _to, _value, _data);
    }


    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransaction(uint _txIndex)
        public
        view
        returns (address to, uint value, bytes memory data)
    {
        Transaction storage transaction = transactions[_txIndex];
        return (transaction.to, transaction.value, transaction.data);
    }


}