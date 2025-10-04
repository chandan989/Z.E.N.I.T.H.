// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFTMarketplace
 * @dev Simple marketplace for trading whole domain NFTs
 * Complements the Exchange contract for fractional shares
 */
contract NFTMarketplace is Ownable, ReentrancyGuard {
    address public paymentToken;
    
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }
    
    // nftContract => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;
    
    event NFTListed(address indexed nftContract, uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(address indexed nftContract, uint256 indexed tokenId, address indexed buyer, address seller, uint256 price);
    event ListingCancelled(address indexed nftContract, uint256 indexed tokenId, address indexed seller);
    
    constructor(address _paymentToken) Ownable(msg.sender) {
        paymentToken = _paymentToken;
    }
    
    function listNFT(address nftContract, uint256 tokenId, uint256 price) external nonReentrant {
        require(price > 0, "Price must be > 0");
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(nft.getApproved(tokenId) == address(this) || nft.isApprovedForAll(msg.sender, address(this)), "Not approved");
        
        listings[nftContract][tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });
        
        emit NFTListed(nftContract, tokenId, msg.sender, price);
    }
    
    function buyNFT(address nftContract, uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.active, "Not listed");
        require(listing.seller != msg.sender, "Cannot buy own NFT");
        
        // Transfer payment
        require(IERC20(paymentToken).transferFrom(msg.sender, listing.seller, listing.price), "Payment failed");
        
        // Transfer NFT
        IERC721(nftContract).safeTransferFrom(listing.seller, msg.sender, tokenId);
        
        emit NFTSold(nftContract, tokenId, msg.sender, listing.seller, listing.price);
        
        // Clear listing
        delete listings[nftContract][tokenId];
    }
    
    function cancelListing(address nftContract, uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[nftContract][tokenId];
        require(listing.active, "Not listed");
        require(listing.seller == msg.sender, "Not the seller");
        
        emit ListingCancelled(nftContract, tokenId, msg.sender);
        delete listings[nftContract][tokenId];
    }
}
