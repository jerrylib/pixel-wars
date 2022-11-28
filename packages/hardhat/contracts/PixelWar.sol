pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract PixelWar {
    mapping(string => string) public colors; // 1-5 => #ddd

    uint256 private maxX;
    uint256 private maxY;

    event ColorUpdate(address updater, uint256 x, uint256 y, string color);

    constructor(uint256 x, uint256 y) payable {
        // what should we do on deploy?
        maxX = x;
        maxY = y;
    }

    function update(
        uint256 x,
        uint256 y,
        string memory color
    ) public payable {
        require(x >= 0, "x must gt 0");
        require(x < maxX, "x must lt max-x");

        require(y >= 0, "y must gt 0");
        require(y < maxY, "y must lt max-y");
        string memory symbol = strConcat(
            strConcat(Strings.toString(x), "-"),
            Strings.toString(y)
        );
        colors[symbol] = color;
        emit ColorUpdate(msg.sender, x, y, color);
    }

    function getMap() public view returns (string[][] memory) {
        string[][] memory rows = new string[][](maxY);
        for (uint256 x = 0; x < maxX; x++) {
            string[] memory cols = new string[](maxX);
            for (uint256 y = 0; y < maxY; y++) {
                cols[y] = (
                    colors[
                        strConcat(
                            strConcat(Strings.toString(x), "-"),
                            Strings.toString(y)
                        )
                    ]
                );
            }
            rows[x] = (cols);
        }
        return rows;
    }

    function strConcat(string memory _a, string memory _b)
        internal
        pure
        returns (string memory)
    {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ret = new string(_ba.length + _bb.length);
        bytes memory bret = bytes(ret);
        uint256 k = 0;
        for (uint256 i = 0; i < _ba.length; i++) bret[k++] = _ba[i];
        for (uint256 i = 0; i < _bb.length; i++) bret[k++] = _bb[i];
        return string(ret);
    }
}
