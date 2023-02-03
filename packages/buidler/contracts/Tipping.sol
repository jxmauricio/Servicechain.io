pragma solidity ^0.6.10;

contract Tipping {
    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTip(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value,
        bytes data
    );

    struct Transaction {
        address to;
        uint value;
        bytes data;
    }

    Transaction[] public transactions;

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
