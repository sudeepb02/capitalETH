pragma solidity ^0.6.0;

/**
@title ILendingPoolAddressesProvider interface
@notice provides the interface to fetch the LendingPoolCore address
 */

interface ILendingPoolAddressesProvider {

    function getLendingPool() external view returns (address);
    
    function getLendingPoolCore() external view returns (address payable);

}