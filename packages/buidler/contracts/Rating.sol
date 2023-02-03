pragma solidity ^0.6.10;

contract Rating {

    struct customerRating{
        address from;
        uint rating;
    }
    mapping(address=>customerRating[]) public ratings;

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
}