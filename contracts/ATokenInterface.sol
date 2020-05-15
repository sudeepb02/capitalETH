pragma solidity ^0.6.0;


interface AToken {

	function redeem(uint256 _amount) external;

	function underlyingAssetAddress() external view returns (address);
}