pragma solidity >=0.7.3;

pragma experimental ABIEncoderV2;

contract HelloWorld {
    struct Message {
        address sender;
        address recipient;
        uint256 timestamp;
        string content;
    }

    mapping(address => Message[]) public sentMessages;
    mapping(address => Message[]) public receivedMessages;

    event MessageSent(
        address indexed sender,
        address indexed recipient,
        uint256 timestamp,
        string content
    );

    function sendMessage(address _recipient, string memory _content) public {
        require(_recipient != address(0), "Recipient address cannot be zero.");
        require(bytes(_content).length > 0, "Message content cannot be empty.");

        Message memory newMessage = Message(
            msg.sender,
            _recipient,
            block.timestamp,
            _content
        );
        sentMessages[msg.sender].push(newMessage);
        receivedMessages[_recipient].push(newMessage);

        emit MessageSent(msg.sender, _recipient, block.timestamp, _content);
    }

    function getSentMessages(
        address _sender
    ) public view returns (Message[] memory) {
        return sentMessages[_sender];
    }

    function getReceivedMessages(
        address _recipient
    ) public view returns (Message[] memory) {
        return receivedMessages[_recipient];
    }
}
