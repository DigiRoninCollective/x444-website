// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title X444PaymentPresets
 * @dev Registry of preset X444 payment contracts with different configurations
 *
 * Three main presets:
 * 1. Creator Basic - For content creators, bloggers, indie devs
 * 2. NFT Drop - For NFT projects with access control
 * 3. E-Commerce - For online stores with inventory
 */

contract X444PaymentPresets {
    // ============ Preset Enum ============
    enum PresetType {
        CREATOR_BASIC,
        NFT_DROP,
        ECOMMERCE
    }

    // ============ Preset Data ============
    struct Preset {
        PresetType presetType;
        address contractAddress;
        string name;
        string description;
        string[] features;
        uint256 estimatedGasCost;
        bool active;
        uint256 createdAt;
    }

    // ============ State ============
    mapping(PresetType => Preset) public presets;
    PresetType[] public activePresets;

    // ============ Events ============
    event PresetRegistered(
        PresetType indexed presetType,
        address indexed contractAddress,
        string name
    );

    event PresetActivated(PresetType indexed presetType);
    event PresetDeactivated(PresetType indexed presetType);

    // ============ Constructor ============
    constructor() {
        // Initialize presets (addresses will be updated after deployment)
        _initializePreset(
            PresetType.CREATOR_BASIC,
            address(0), // Will be updated
            "Creator Basic",
            "Perfect for content creators - earn 1% on every payment",
            new string[](0)
        );

        _initializePreset(
            PresetType.NFT_DROP,
            address(0), // Will be updated
            "NFT Drop",
            "For NFT creators with access control and batch support",
            new string[](0)
        );

        _initializePreset(
            PresetType.ECOMMERCE,
            address(0), // Will be updated
            "E-Commerce",
            "For online stores with inventory and order tracking",
            new string[](0)
        );
    }

    // ============ Admin Functions ============

    /**
     * @dev Update preset contract address
     */
    function updatePresetAddress(
        PresetType _presetType,
        address _newAddress
    ) external {
        require(_newAddress != address(0), "Invalid address");
        presets[_presetType].contractAddress = _newAddress;

        emit PresetRegistered(
            _presetType,
            _newAddress,
            presets[_presetType].name
        );
    }

    /**
     * @dev Update preset features
     */
    function updatePresetFeatures(
        PresetType _presetType,
        string[] calldata _features
    ) external {
        require(_features.length <= 10, "Too many features");
        presets[_presetType].features = _features;
    }

    /**
     * @dev Update preset gas estimate
     */
    function updatePresetGasEstimate(
        PresetType _presetType,
        uint256 _gasCost
    ) external {
        presets[_presetType].estimatedGasCost = _gasCost;
    }

    /**
     * @dev Activate a preset
     */
    function activatePreset(PresetType _presetType) external {
        require(!presets[_presetType].active, "Already active");
        presets[_presetType].active = true;
        emit PresetActivated(_presetType);
    }

    /**
     * @dev Deactivate a preset
     */
    function deactivatePreset(PresetType _presetType) external {
        require(presets[_presetType].active, "Already inactive");
        presets[_presetType].active = false;
        emit PresetDeactivated(_presetType);
    }

    // ============ View Functions ============

    /**
     * @dev Get preset by type
     */
    function getPreset(PresetType _presetType) external view returns (Preset memory) {
        return presets[_presetType];
    }

    /**
     * @dev Get all active presets
     */
    function getActivePresets() external view returns (Preset[] memory) {
        uint256 count = 0;

        // Count active presets
        for (uint256 i = 0; i < 3; i++) {
            PresetType presetType = PresetType(i);
            if (presets[presetType].active) {
                count++;
            }
        }

        // Build array
        Preset[] memory active = new Preset[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < 3; i++) {
            PresetType presetType = PresetType(i);
            if (presets[presetType].active) {
                active[index] = presets[presetType];
                index++;
            }
        }

        return active;
    }

    /**
     * @dev Check if preset is valid
     */
    function isValidPreset(PresetType _presetType) external view returns (bool) {
        return (
            presets[_presetType].active &&
            presets[_presetType].contractAddress != address(0)
        );
    }

    /**
     * @dev Get contract address for preset
     */
    function getPresetAddress(PresetType _presetType) external view returns (address) {
        require(presets[_presetType].contractAddress != address(0), "Preset not set");
        return presets[_presetType].contractAddress;
    }

    // ============ Internal Functions ============

    function _initializePreset(
        PresetType _presetType,
        address _contractAddress,
        string memory _name,
        string memory _description,
        string[] memory _features
    ) internal {
        presets[_presetType] = Preset({
            presetType: _presetType,
            contractAddress: _contractAddress,
            name: _name,
            description: _description,
            features: _features,
            estimatedGasCost: 0,
            active: false,
            createdAt: block.timestamp
        });
    }
}
