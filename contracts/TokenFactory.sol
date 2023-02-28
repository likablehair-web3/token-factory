// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Token.sol";

contract TokenFactory is Ownable {
    address[] public tokenContracts;
    uint256 public tokenCounter;
    mapping(address => bool) public isTokenDeployed;

    constructor() {}

    function addTokenToDeployedToken(address token) internal {
        tokenContracts.push(token);
        isTokenDeployed[token] = true;
        tokenCounter++;
    }

    function deployNewToken(
        string memory name,
        string memory symbol,
        uint256 supply,
        address newOwner
    ) external onlyOwner returns (address) {
        Token newToken = new Token(name, symbol, supply);
        newToken.transferOwnership(newOwner);
        newToken.transfer(newOwner, supply * (1e18));
        addTokenToDeployedToken(address(newToken));
        return address(newToken);
    }

    function getTokenAddress(uint256 _idx) external view returns (address) {
        return tokenContracts[_idx];
    }

    function getTokenCounter() external view returns (uint256) {
        return tokenCounter;
    }

    function getTokenDeployed(address token) external view returns (bool) {
        return isTokenDeployed[token];
    }
}
