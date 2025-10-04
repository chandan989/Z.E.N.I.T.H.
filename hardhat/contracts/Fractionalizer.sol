// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./FractionalToken.sol";

/**
 * @title Fractionalizer
 * @dev This contract vaults a DomainNFT and deploys an ERC20 contract for fractional shares.
 */
contract Fractionalizer is Ownable {
    address public domainNFTAddress;
    address public genesisEngineAddress;

    // Mappings and arrays for asset discovery
    mapping(uint256 => address) public fractionContracts;
    mapping(address => uint256) public nftTokenIds; // Reverse mapping
    address[] public allFractionContracts;

    event Fractionalized(
        uint256 indexed tokenId,
        address indexed fractionContract,
        address indexed owner,
        uint256 totalSupply
    );

    modifier onlyGenesisEngine() {
        require(msg.sender == genesisEngineAddress, "Caller is not the GenesisEngine");
        _;
    }

    constructor(address _domainNFTAddress) Ownable(msg.sender) {
        domainNFTAddress = _domainNFTAddress;
    }

    function setGenesisEngineAddress(address _genesisEngineAddress) external onlyOwner {
        genesisEngineAddress = _genesisEngineAddress;
    }

    function fractionalize(
        uint256 tokenId,
        string memory name,
        string memory symbol,
        uint256 supply
    ) external onlyGenesisEngine {
        require(fractionContracts[tokenId] == address(0), "Already fractionalized");
        require(bytes(name).length > 0 && bytes(name).length <= 50, "Invalid name");
        require(bytes(symbol).length > 0 && bytes(symbol).length <= 10, "Invalid symbol");
        
        IERC721 domainNFT = IERC721(domainNFTAddress);
        require(domainNFT.ownerOf(tokenId) == msg.sender, "Caller must be the owner of the NFT");

        // Use transferFrom instead of safeTransferFrom since this contract doesn't need to implement IERC721Receiver
        domainNFT.transferFrom(msg.sender, address(this), tokenId);

        FractionalToken fractionToken = new FractionalToken(name, symbol, supply);
        address fractionContractAddress = address(fractionToken);

        // Update state for asset discovery
        fractionContracts[tokenId] = fractionContractAddress;
        nftTokenIds[fractionContractAddress] = tokenId;
        allFractionContracts.push(fractionContractAddress);

        fractionToken.transfer(msg.sender, supply);

        emit Fractionalized(tokenId, fractionContractAddress, msg.sender, supply);
    }

    function getAllFractionalTokens() external view returns (address[] memory) {
        return allFractionContracts;
    }
}
