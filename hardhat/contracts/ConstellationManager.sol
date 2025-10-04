// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ConstellationToken
 * @dev ERC20 token representing shares in a constellation (portfolio basket)
 */
contract ConstellationToken is ERC20 {
    address public manager;
    
    constructor(string memory name, string memory symbol, address _manager) ERC20(name, symbol) {
        manager = _manager;
    }
    
    function mint(address to, uint256 amount) external {
        require(msg.sender == manager, "Only manager can mint");
        _mint(to, amount);
    }
    
    function burn(address from, uint256 amount) external {
        require(msg.sender == manager, "Only manager can burn");
        _burn(from, amount);
    }
}

/**
 * @title ConstellationManager
 * @dev Manages portfolio baskets (Constellations) of domain NFTs
 * Users can buy/sell shares of curated domain portfolios
 */
contract ConstellationManager is Ownable, ReentrancyGuard {
    uint256 private _constellationIds;
    address public domainNFTAddress;
    
    struct Constellation {
        string name;
        string symbol;
        address shareToken;
        uint256[] nftTokenIds;
        uint256 totalShares;
        address curator;
        bool active;
        uint256 createdAt;
    }
    
    mapping(uint256 => Constellation) public constellations;
    mapping(uint256 => uint256) public nftToConstellation; // NFT tokenId => constellation ID
    mapping(uint256 => mapping(uint256 => uint256)) public nftIndexInConstellation; // constellationId => tokenId => index
    
    event ConstellationCreated(uint256 indexed constellationId, string name, address shareToken, address curator);
    event NFTAddedToConstellation(uint256 indexed constellationId, uint256 indexed tokenId);
    event NFTRemovedFromConstellation(uint256 indexed constellationId, uint256 indexed tokenId);
    event SharesMinted(uint256 indexed constellationId, address indexed to, uint256 amount);
    event SharesBurned(uint256 indexed constellationId, address indexed from, uint256 amount);
    
    constructor(address _domainNFTAddress) Ownable(msg.sender) {
        domainNFTAddress = _domainNFTAddress;
    }
    
    /**
     * @dev Create a new constellation (portfolio basket)
     * @param name Name of the constellation (e.g., "Orion AI Domains")
     * @param symbol Token symbol (e.g., "ORION")
     * @param nftTokenIds Array of NFT token IDs to include
     * @param sharesPerNFT How many shares each NFT represents
     */
    function createConstellation(
        string memory name,
        string memory symbol,
        uint256[] memory nftTokenIds,
        uint256 sharesPerNFT
    ) external nonReentrant returns (uint256) {
        require(nftTokenIds.length > 0, "Must include at least one NFT");
        require(sharesPerNFT > 0, "Shares per NFT must be > 0");
        
        _constellationIds++;
        uint256 constellationId = _constellationIds;
        
        // Deploy share token
        ConstellationToken shareToken = new ConstellationToken(name, symbol, address(this));
        
        // Calculate total shares
        uint256 totalShares = nftTokenIds.length * sharesPerNFT;
        
        // Create constellation
        constellations[constellationId] = Constellation({
            name: name,
            symbol: symbol,
            shareToken: address(shareToken),
            nftTokenIds: nftTokenIds,
            totalShares: totalShares,
            curator: msg.sender,
            active: true,
            createdAt: block.timestamp
        });
        
        // Transfer NFTs to this contract and track them
        IERC721 nft = IERC721(domainNFTAddress);
        for (uint256 i = 0; i < nftTokenIds.length; i++) {
            uint256 tokenId = nftTokenIds[i];
            require(nft.ownerOf(tokenId) == msg.sender, "Not owner of NFT");
            require(nftToConstellation[tokenId] == 0, "NFT already in constellation");
            
            nft.transferFrom(msg.sender, address(this), tokenId);
            nftToConstellation[tokenId] = constellationId;
            nftIndexInConstellation[constellationId][tokenId] = i;
            
            emit NFTAddedToConstellation(constellationId, tokenId);
        }
        
        // Mint shares to curator
        shareToken.mint(msg.sender, totalShares);
        
        emit ConstellationCreated(constellationId, name, address(shareToken), msg.sender);
        emit SharesMinted(constellationId, msg.sender, totalShares);
        
        return constellationId;
    }
    
    /**
     * @dev Add NFT to existing constellation (curator only)
     */
    function addNFTToConstellation(uint256 constellationId, uint256 tokenId, uint256 additionalShares) external nonReentrant {
        Constellation storage constellation = constellations[constellationId];
        require(constellation.active, "Constellation not active");
        require(constellation.curator == msg.sender, "Not the curator");
        require(nftToConstellation[tokenId] == 0, "NFT already in constellation");
        
        IERC721 nft = IERC721(domainNFTAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not owner of NFT");
        
        // Transfer NFT
        nft.transferFrom(msg.sender, address(this), tokenId);
        
        // Update constellation
        constellation.nftTokenIds.push(tokenId);
        nftToConstellation[tokenId] = constellationId;
        nftIndexInConstellation[constellationId][tokenId] = constellation.nftTokenIds.length - 1;
        
        // Mint additional shares to curator
        constellation.totalShares += additionalShares;
        ConstellationToken(constellation.shareToken).mint(msg.sender, additionalShares);
        
        emit NFTAddedToConstellation(constellationId, tokenId);
        emit SharesMinted(constellationId, msg.sender, additionalShares);
    }
    
    /**
     * @dev Redeem shares for proportional NFTs (if you own enough shares)
     * Burns shares and returns NFTs
     */
    function redeemShares(uint256 constellationId, uint256 sharesToBurn) external nonReentrant {
        Constellation storage constellation = constellations[constellationId];
        require(constellation.active, "Constellation not active");
        require(sharesToBurn > 0, "Must burn > 0 shares");
        
        ConstellationToken shareToken = ConstellationToken(constellation.shareToken);
        require(shareToken.balanceOf(msg.sender) >= sharesToBurn, "Insufficient shares");
        
        // Calculate how many NFTs to return (proportional)
        uint256 nftsToReturn = (sharesToBurn * constellation.nftTokenIds.length) / constellation.totalShares;
        require(nftsToReturn > 0, "Not enough shares to redeem NFT");
        require(nftsToReturn <= constellation.nftTokenIds.length, "Invalid calculation");
        
        // Burn shares
        shareToken.burn(msg.sender, sharesToBurn);
        constellation.totalShares -= sharesToBurn;
        
        // Transfer NFTs
        IERC721 nft = IERC721(domainNFTAddress);
        for (uint256 i = 0; i < nftsToReturn; i++) {
            uint256 tokenId = constellation.nftTokenIds[constellation.nftTokenIds.length - 1];
            constellation.nftTokenIds.pop();
            
            nft.transferFrom(address(this), msg.sender, tokenId);
            delete nftToConstellation[tokenId];
            delete nftIndexInConstellation[constellationId][tokenId];
            
            emit NFTRemovedFromConstellation(constellationId, tokenId);
        }
        
        emit SharesBurned(constellationId, msg.sender, sharesToBurn);
        
        // Deactivate if empty
        if (constellation.nftTokenIds.length == 0) {
            constellation.active = false;
        }
    }
    
    /**
     * @dev Get all NFTs in a constellation
     */
    function getConstellationNFTs(uint256 constellationId) external view returns (uint256[] memory) {
        return constellations[constellationId].nftTokenIds;
    }
    
    /**
     * @dev Get constellation details
     */
    function getConstellation(uint256 constellationId) external view returns (
        string memory name,
        string memory symbol,
        address shareToken,
        uint256 nftCount,
        uint256 totalShares,
        address curator,
        bool active
    ) {
        Constellation storage c = constellations[constellationId];
        return (c.name, c.symbol, c.shareToken, c.nftTokenIds.length, c.totalShares, c.curator, c.active);
    }
    
    /**
     * @dev Get total number of constellations
     */
    function totalConstellations() external view returns (uint256) {
        return _constellationIds;
    }
}
