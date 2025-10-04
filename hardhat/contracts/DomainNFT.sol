// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DomainNFT
 * @dev This contract represents a tokenized domain name as a unique ERC-721 NFT.
 * It allows a designated GenesisEngine contract to mint new domain NFTs.
 */
contract DomainNFT is ERC721Enumerable, Ownable {
    uint256 private _tokenIdCounter = 1; // Start from 1 instead of 0

    address public genesisEngineAddress;

    // Mappings for token data
    mapping(uint256 => string) private _domainNames;
    mapping(uint256 => uint256) public domaScores;

    string private _baseURIString;

    modifier onlyGenesisEngine() {
        require(msg.sender == genesisEngineAddress, "Caller is not the GenesisEngine");
        _;
    }

    constructor() ERC721("Zenith Domain NFT", "ZDN") Ownable(msg.sender) {}

    function setGenesisEngineAddress(address _genesisEngineAddress) external onlyOwner {
        genesisEngineAddress = _genesisEngineAddress;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseURIString = baseURI_;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseURIString;
    }

    /**
     * @dev Mints a new domain NFT, including its DomaScore.
     * Can only be called by the GenesisEngine contract.
     */
    function safeMint(address to, string memory domainName, uint256 domaScore) public onlyGenesisEngine returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _domainNames[tokenId] = domainName;
        domaScores[tokenId] = domaScore;
        _tokenIdCounter++;
        return tokenId;
    }

    function getDomainName(uint256 tokenId) external view returns (string memory) {
        require(tokenId < _tokenIdCounter, "ERC721Metadata: URI query for nonexistent token");
        return _domainNames[tokenId];
    }
}
