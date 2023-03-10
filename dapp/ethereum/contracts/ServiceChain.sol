pragma solidity ^0.8.17;

contract Factory{
    address[] public deployedServices;
    string[] public deployedOrgNames;
    address public manager;
    mapping(address=>string) public orgNames;
    //in the front end we do all conversions to wei
    function createService( string calldata org,uint hourRate) public payable{
        manager = msg.sender;
        Service newService = new Service(msg.sender,org,hourRate);
        deployedOrgNames.push(org);
        address newContractAddr = address(newService);
        deployedServices.push(newContractAddr);
        newService.deposit{value:msg.value}();
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
        uint estimatedPayement;
        bool isApproved;
    }

    event Deposit(address indexed sender, uint amount, uint balance,uint date);
    event submitRating(address indexed sender, address indexed recipient, uint indexed rating);
    event submitApproval(address indexed sender,address indexed recipient, bool indexed isApproved,uint forDate,uint hour,uint amountPaid);
    event submitTip(address indexed sender,address indexed recipient,uint tipAmount);
    event submitHourlyRate(address indexed sender,uint indexed date,uint hourlyRate);

    Transaction[] public transactions;
    mapping(address=>hourLog[]) public empHours;
    
    string public org;
    address public manager;
    uint public hourlyRate;


    constructor(address sender, string memory organization,uint pay) {
        manager=sender;
        org = organization;
        hourlyRate = pay;
    }
    //sets the hourly rate of employees 
    function setHourlyRate(uint rate) public {
        emit submitHourlyRate(msg.sender,block.timestamp,rate);
        hourlyRate = rate;

    }
    //Logging
    //Allow a given employee to request hours across 7 different days for each day of the week 
    function requestHours(uint value) public{
        //Can only push new hours if the previous was approved or it is a new request
        require(empHours[msg.sender].length < 8);
        empHours[msg.sender].push(hourLog(block.timestamp,value,hourlyRate * value,false));
    }
    //Manager is given the array of pending requests for a given waiter
    //the logic on frontend is to render the requests and assign indices to each request and when apporved is clicked delete the entry at the given index
    function confirmHours(address payable waiter,uint index) public payable{
        require(msg.sender == manager,"You are not the manager");
        //send the event to this contracts log for it to be saved and allows us to retrieve the data on a waiter 
        emit submitApproval(msg.sender,waiter,true,empHours[waiter][index].date, empHours[waiter][index].hour,hourlyRate * empHours[waiter][index].hour);
        //transfer funds to the waiter/need to charge the amount using front end
        waiter.transfer(hourlyRate* empHours[waiter][index].hour);
        //deletes the entry at a specific index
        for(uint i =index;i<empHours[waiter].length-1;i++){
            empHours[waiter][i] = empHours[waiter][i+1];
        }
        empHours[waiter].pop();     
    }
    function denyHours(address waiter,uint index) public{
        require(msg.sender == manager,"You are not the manager");
        //send the event to this contracts log for it to be saved and allows us to retrieve the data on a waiter 
        emit submitApproval(msg.sender,waiter,false,empHours[waiter][index].date, empHours[waiter][index].hour,0);
        //deletes the entry at a specific index
        for(uint i =index;i<empHours[waiter].length-1;i++){
            empHours[waiter][i] = empHours[waiter][i+1];
        }
        empHours[waiter].pop();  
    }
    //gives us the pending requests of a waiter;zzz
    function getHourLog(address waiter) public view returns(hourLog[] memory){
        return empHours[waiter];

    }

    //Rating
    function sendRatings(address waiter,uint rating) public {
        require(rating >= 0 && rating <=5);
        emit submitRating(msg.sender,waiter,rating);
    }
    //called to send the total bill
    function deposit() public payable {
        emit Deposit(msg.sender,msg.value, address(this).balance,block.timestamp);
    }
    //A payable function where the the frontend calls this function with a user and sends a value with the transaction 
    function sendTip(address payable recipient) public payable {
        recipient.transfer(msg.value);
        emit submitTip(msg.sender, recipient, msg.value );
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }



}