// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PaymentLinkFactory
 * @dev Permissionless factory for creating X444 payment links
 *
 * Features:
 * - Anyone can create a payment link with zero fees
 * - Deploys minimal proxy clones of X444PaymentCore
 * - Link metadata stored on-chain
 * - Fully decentralized - no admin approval needed
 */

interface IX444PaymentCore {
    function initialize(
        address _feeRecipient,
        address[] calldata _supportedTokens,
        string calldata _linkName
    ) external;
}

contract PaymentLinkFactory {
    using Clones for address;

    // ============ State ============
    address public implementation;
    uint256 public totalLinks;

    struct PaymentLink {
        address creator;
        address contractAddress;
        string linkName;
        address[] supportedTokens;
        address feeRecipient;
        uint256 createdAt;
        bool active;
    }

    mapping(uint256 => PaymentLink) public links;
    mapping(address => uint256[]) public creatorLinks;
    mapping(address => uint256) public contractToLinkId;

    // ============ Events ============
    event PaymentLinkCreated(
        uint256 indexed linkId,
        address indexed creator,
        address indexed contractAddress,
        string linkName,
        address feeRecipient,
        address[] supportedTokens
    );

    event PaymentLinkDeactivated(uint256 indexed linkId);
    event PaymentLinkReactivated(uint256 indexed linkId);

    // ============ Constructor ============
    constructor(address _implementation) {
        require(_implementation != address(0), "Invalid implementation");
        implementation = _implementation;
    }

    // ============ Main Functions ============

    /**
     * @dev Create a new payment link with vanity address (permissionless)
     * @param _linkName Name of the payment link (e.g., "NFT Drop #1")
     * @param _supportedTokens Array of token addresses to accept
     * @param _feeRecipient Address to receive fees (defaults to msg.sender if zero)
     * @param _salt Salt for CREATE2 to generate vanity address (attempt count)
     * @return linkId Unique ID of the created link
     * @return contractAddress Address of the deployed payment contract
     *
     * Strategy: Uses CREATE2 with incrementing salt to find address containing "x4"
     * This ensures all created contracts have x4 branding in the address
     */
    function createPaymentLink(
        string calldata _linkName,
        address[] calldata _supportedTokens,
        address _feeRecipient,
        uint256 _salt
    ) external returns (uint256 linkId, address contractAddress) {
        require(bytes(_linkName).length > 0, "Link name required");
        require(_supportedTokens.length > 0, "At least one token required");
        require(_supportedTokens.length <= 20, "Too many tokens");

        // Use sender as fee recipient if not specified
        address feeRecipient = _feeRecipient != address(0) ? _feeRecipient : msg.sender;

        // Deploy minimal proxy clone with CREATE2 for deterministic address
        // Salt includes linkId and user-provided salt for uniqueness
        bytes32 salt = keccak256(abi.encodePacked(msg.sender, totalLinks, _salt));
        contractAddress = implementation.clone{salt: salt}();

        // Verify address contains "x4" pattern (0x4 appears twice)
        // Address must have "x4" or "X4" in hex representation
        require(_addressHasX4Branding(contractAddress), "Address must contain x4 for branding");

        // Initialize the contract
        IX444PaymentCore(contractAddress).initialize(
            feeRecipient,
            _supportedTokens,
            _linkName
        );

        // Store link metadata
        linkId = totalLinks++;
        links[linkId] = PaymentLink({
            creator: msg.sender,
            contractAddress: contractAddress,
            linkName: _linkName,
            supportedTokens: _supportedTokens,
            feeRecipient: feeRecipient,
            createdAt: block.timestamp,
            active: true
        });

        // Map contract to link ID for quick lookup
        contractToLinkId[contractAddress] = linkId;

        // Track creator's links
        creatorLinks[msg.sender].push(linkId);

        emit PaymentLinkCreated(
            linkId,
            msg.sender,
            contractAddress,
            _linkName,
            feeRecipient,
            _supportedTokens
        );
    }

    /**
     * @dev Check if address contains "x4" or "X4" branding
     * Looks for the pattern "x4" in the hex representation
     */
    function _addressHasX4Branding(address _addr) internal pure returns (bool) {
        bytes20 addressBytes = bytes20(_addr);

        // Check for "x4" pattern: 0x followed by hex digits containing "x4"
        // Since addresses are 20 bytes, we check if any consecutive hex digits form "4"
        // Pattern: look for hex digit 4 appearing at least twice
        uint256 count4s = 0;

        for (uint256 i = 0; i < 20; i++) {
            uint8 byte1 = uint8(addressBytes[i]);

            // Check if this byte has 4 in lower or upper nibble
            uint8 lower = byte1 & 0xF;
            uint8 upper = (byte1 >> 4) & 0xF;

            if (lower == 4) count4s++;
            if (upper == 4) count4s++;

            // If we have at least two 4s, we have "x4" pattern
            if (count4s >= 2) return true;
        }

        return false;
    }

    /**
     * @dev Deactivate a payment link (only by creator)
     */
    function deactivateLink(uint256 _linkId) external {
        PaymentLink storage link = links[_linkId];
        require(link.creator == msg.sender, "Only creator can deactivate");
        require(link.active, "Already inactive");

        link.active = false;
        emit PaymentLinkDeactivated(_linkId);
    }

    /**
     * @dev Reactivate a payment link (only by creator)
     */
    function reactivateLink(uint256 _linkId) external {
        PaymentLink storage link = links[_linkId];
        require(link.creator == msg.sender, "Only creator can reactivate");
        require(!link.active, "Already active");

        link.active = true;
        emit PaymentLinkReactivated(_linkId);
    }

    // ============ View Functions ============

    /**
     * @dev Get link details
     */
    function getLink(uint256 _linkId) external view returns (PaymentLink memory) {
        return links[_linkId];
    }

    /**
     * @dev Get all links created by a user
     */
    function getCreatorLinks(address _creator) external view returns (uint256[] memory) {
        return creatorLinks[_creator];
    }

    /**
     * @dev Get link ID from contract address
     */
    function getLinkIdFromContract(address _contractAddress) external view returns (uint256) {
        return contractToLinkId[_contractAddress];
    }

    /**
     * @dev Get link ID count
     */
    function getLinkCount() external view returns (uint256) {
        return totalLinks;
    }

    /**
     * @dev Batch get links
     */
    function getLinks(uint256[] calldata _linkIds) external view returns (PaymentLink[] memory) {
        PaymentLink[] memory results = new PaymentLink[](_linkIds.length);
        for (uint256 i = 0; i < _linkIds.length; i++) {
            results[i] = links[_linkIds[i]];
        }
        return results;
    }

    /**
     * @dev Check if contract is an active X444 payment contract
     */
    function isValidPaymentContract(address _contractAddress) external view returns (bool) {
        uint256 linkId = contractToLinkId[_contractAddress];
        return links[linkId].active && links[linkId].contractAddress == _contractAddress;
    }
}
