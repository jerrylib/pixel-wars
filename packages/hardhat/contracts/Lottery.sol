pragma solidity >=0.8.0 <0.9.0;
import "hardhat/console.sol";

contract Lottery {
    address public owner;
    address[] public players;

    event Participate(address sender, uint16 turn);

    event PickWinner(address sender, address winner);

    constructor() public {
        owner = msg.sender;
    }

    function participate(uint16 turn) public payable {
        require(msg.value == turn * 1e18, "deposit amount not match");
        for (uint256 x = 0; x < turn; x++) {
            players.push(msg.sender);
        }
        emit Participate(msg.sender, turn);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public {
        uint256 balance = address(this).balance;
        require(players.length > 0, "must 1 person deposited");
        require(balance >= 5 ether, "must deposited over 5 ethers");

        uint256 index = random() % players.length;
        payable(owner).transfer(balance / 100);
        payable(msg.sender).transfer(balance / 100);
        payable(players[index]).transfer(address(this).balance);
        emit PickWinner(msg.sender, players[index]);

        players = new address[](0);
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }

    // to support receiving ETH by default
    receive() external payable {}

    fallback() external payable {}
}
