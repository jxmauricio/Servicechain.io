pragma solidity ^0.6.10;

contract Log{

    mapping(address=>uint[]) public hourLog;

    function enterHours(address waiter,uint value) public{
        hourLog[waiter].push(value);
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

}