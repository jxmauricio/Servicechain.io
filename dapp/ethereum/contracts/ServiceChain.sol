pragma solidity ^0.8.17;

contract Factory{
    address[] public deployedServices;
    string[] public deployedOrgNames;
    address public manager;
    mapping(address=>string) public orgNames;
    function createService( string calldata org) public {
        manager = msg.sender;
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

    struct hourLog {
        uint date;
        uint hour;
        bool isApproved;
    }

    event Deposit(address indexed sender, uint amount, uint balance);
    event submitRating(address indexed sender, address indexed recipient, uint rating);
    event submitApproval(address indexed sender,address indexed recipient, uint indexed forDate, uint hour);
    event SubmitTip(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value,
        bytes data
    );


    Transaction[] public transactions;
    mapping(address=>hourLog[]) public empHours;
    mapping(address=>customerRating[]) public ratings;
    string public org;
    address public manager;


    constructor(address sender, string memory organization) {
        manager=sender;
        org = organization;
    }
    //Logging
    //Allow a given employee to request hours across 7 different days for each day of the week 
    function requestHours(uint value) public{
        //Can only push new hours if the previous was approved or it is a new request
        require(empHours[msg.sender].length < 8);
        empHours[msg.sender].push(hourLog(block.timestamp,value,false));
    }
    //Manager is given the array of pending requests for a given waiter
    //the logic on frontend is to render the requests and assign indices to each request and when apporved is clicked delete the entry at the given index
    function confirmHours(address waiter,uint index) public{
        require(msg.sender == manager,"You are not the manager");
        //send the event to this contracts log for it to be saved and allows us to retrieve the data on a waiter 
        emit submitApproval(msg.sender,waiter,empHours[waiter][index].date, empHours[waiter][index].hour);
        //deletes the entry at a specific index
        for(uint i =index;i<empHours[waiter].length-1;i++){
            empHours[waiter][i] = empHours[waiter][i+1];
        }
        empHours[waiter].pop(); 
        empHours[waiter][index].isApproved= true;      
    }
    //gives us the pending requests of a waiter;zzz
    function getHourLog(address waiter) public view returns(hourLog[] memory){
        return empHours[waiter];

    }

//Rating
    function sendRatings(address customer,address waiter,uint rating) public {
        emit submitRating(customer,waiter,rating);
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