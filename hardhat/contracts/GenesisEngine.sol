// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./DomainNFT.sol";
import "./Fractionalizer.sol";

/**
 * @title GenesisEngine
 * @dev Main orchestration contract for onboarding new assets (domain names).
 * Implements a two-step process for security: request and fulfillment.
 */
contract GenesisEngine is Ownable {
    using Counters for Counters.Counter;

    address public domainNFTAddress;
    address public fractionalizerAddress;

    Counters.Counter private _requestIds;
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

    event OnboardingRequested(uint256 indexed requestId, address indexed assetOwner, string domainName);
    event AssetOnboarded(address indexed owner, uint256 indexed tokenId, address fractionContract, string domainName);

    constructor() Ownable(msg.sender) {}

    function setAddresses(address _domainNFTAddress, address _fractionalizerAddress) external onlyOwner {
        domainNFTAddress = _domainNFTAddress;
        fractionalizerAddress = _fractionalizerAddress;
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
        _requestIds.increment();
        uint256 newRequestId = _requestIds.current();

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
    function fulfillOnboarding(uint256 requestId) external onlyOwner {
        OnboardingRequest storage request = onboardingRequests[requestId];
        require(request.exists, "Request does not exist");

        DomainNFT domainNFT = DomainNFT(domainNFTAddress);
        Fractionalizer fractionalizer = Fractionalizer(fractionalizerAddress);

        // 1. Mint the DomainNFT, now with DomaScore
        uint256 tokenId = domainNFT.safeMint(address(this), request.domainName, request.domaScore);

        // 2. Approve the Fractionalizer
        domainNFT.approve(fractionalizerAddress, tokenId);

        // 3. Fractionalize the NFT
        fractionalizer.fractionalize(tokenId, request.tokenName, request.tokenSymbol, request.tokenSupply);

        // 4. Transfer shares to the asset owner
        address fractionContractAddress = fractionalizer.fractionContracts(tokenId);
        IERC20 fractionToken = IERC20(fractionContractAddress);
        fractionToken.transfer(request.assetOwner, request.tokenSupply);

        emit AssetOnboarded(request.assetOwner, tokenId, fractionContractAddress, request.domainName);

        delete onboardingRequests[requestId];
    }
}
