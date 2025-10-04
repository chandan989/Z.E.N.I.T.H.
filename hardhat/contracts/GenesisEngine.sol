// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./DomainNFT.sol";
import "./Fractionalizer.sol";

/**
 * @title GenesisEngine
 * @dev Main orchestration contract for onboarding new assets (domain names).
 * Implements a two-step process for security: request and fulfillment.
 */
contract GenesisEngine is Ownable, ReentrancyGuard, IERC721Receiver {
    address public domainNFTAddress;
    address public fractionalizerAddress;

    uint256 private _requestIds;
    struct OnboardingRequest {
        address assetOwner;
        string domainName;
        string tokenName;
        string tokenSymbol;
        uint256 tokenSupply;
        uint256 domaScore; // Added DomaScore
        bool exists;
    }
    mapping(uint256 => OnboardingRequest) public onboardingRequests;
    mapping(string => bool) public tokenizedDomains; // Prevent duplicate domains

    event OnboardingRequested(uint256 indexed requestId, address indexed assetOwner, string domainName);
    event AssetOnboarded(address indexed owner, uint256 indexed tokenId, address fractionContract, string domainName);
    event AddressesUpdated(address indexed domainNFT, address indexed fractionalizer);

    bool private _addressesLocked;

    constructor() Ownable(msg.sender) {}

    function setAddresses(address _domainNFTAddress, address _fractionalizerAddress) external onlyOwner {
        require(!_addressesLocked, "Addresses are locked");
        require(_domainNFTAddress != address(0) && _fractionalizerAddress != address(0), "Invalid addresses");
        domainNFTAddress = _domainNFTAddress;
        fractionalizerAddress = _fractionalizerAddress;
        emit AddressesUpdated(_domainNFTAddress, _fractionalizerAddress);
    }

    function lockAddresses() external onlyOwner {
        _addressesLocked = true;
    }

    /**
     * @dev Required to receive ERC721 tokens via safeTransferFrom
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    /**
     * @dev Step 1: A user requests to onboard a domain, including its DomaScore.
     */
    function requestOnboarding(
        string memory domainName,
        string memory tokenName,
        string memory tokenSymbol,
        uint256 tokenSupply,
        uint256 domaScore // Added DomaScore
    ) external returns (uint256) {
        require(bytes(domainName).length > 0, "Domain name cannot be empty");
        require(!tokenizedDomains[domainName], "Domain already tokenized");
        require(tokenSupply > 0 && tokenSupply <= 1e27, "Invalid token supply");
        require(domaScore > 0 && domaScore <= 1000, "DomaScore must be between 1-1000");
        
        tokenizedDomains[domainName] = true;
        
        _requestIds++;
        uint256 newRequestId = _requestIds;

        onboardingRequests[newRequestId] = OnboardingRequest({
            assetOwner: msg.sender,
            domainName: domainName,
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            tokenSupply: tokenSupply,
            domaScore: domaScore, // Store DomaScore
            exists: true
        });

        emit OnboardingRequested(newRequestId, msg.sender, domainName);
        return newRequestId;
    }

    /**
     * @dev Step 2: The contract owner fulfills the onboarding request.
     */
    function fulfillOnboarding(uint256 requestId) external onlyOwner nonReentrant {
        OnboardingRequest storage request = onboardingRequests[requestId];
        require(request.exists, "Request does not exist");
        require(domainNFTAddress != address(0) && fractionalizerAddress != address(0), "Addresses not set");

        // Store all data BEFORE delete to prevent data loss
        address assetOwner = request.assetOwner;
        string memory domainName = request.domainName;
        string memory tokenName = request.tokenName;
        string memory tokenSymbol = request.tokenSymbol;
        uint256 tokenSupply = request.tokenSupply;
        uint256 domaScore = request.domaScore;
        
        // Delete request (CEI pattern)
        delete onboardingRequests[requestId];

        DomainNFT domainNFT = DomainNFT(domainNFTAddress);
        Fractionalizer fractionalizer = Fractionalizer(fractionalizerAddress);

        // 1. Mint the DomainNFT with stored data
        uint256 tokenId = domainNFT.safeMint(address(this), domainName, domaScore);

        // 2. Approve the Fractionalizer
        domainNFT.approve(fractionalizerAddress, tokenId);

        // 3. Fractionalize the NFT with stored data
        fractionalizer.fractionalize(tokenId, tokenName, tokenSymbol, tokenSupply);

        // 4. Transfer shares to the asset owner
        address fractionContractAddress = fractionalizer.fractionContracts(tokenId);
        IERC20 fractionToken = IERC20(fractionContractAddress);
        require(fractionToken.transfer(assetOwner, tokenSupply), "Token transfer failed");

        emit AssetOnboarded(assetOwner, tokenId, fractionContractAddress, domainName);
    }
}
