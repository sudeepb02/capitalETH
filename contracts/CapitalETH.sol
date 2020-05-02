pragma solidity ^0.6.0;

import "./ERC20Interface.sol";
import "./KyberNetworkProxy.sol";

contract CapitalETH {

    address payable public owner;

    mapping (address => bool) public processors;        //Mapping of all valid SIP processors
    mapping (address => uint) public userSIPCount;      //Mapping of Address to SIP count
    mapping (uint => address) public idToAddress;       //Mapping of SIP id to user address

    enum Status{ active, paused }
    uint totalSIPCount;

    //Structure of the SIP Plan
    struct Plan {

        uint id;            //Unique ID of SIP

        address payable srcAccount;         //Wallet address from where source token will be debited
        address payable destAccount;        //Wallet address where the destination token will be deposited

        address srcToken;           //Address of source Token (ERC20)
        address destToken;          //Address of destination Token (ERC20)

        uint period;        //Number of days between deduction
        Status status;      //Status of the investment plan

        uint amount;        //Amount to be deducted every period interval (18 decimals)
        uint lastTx;        //Timestamp of the last transaction
    }

    //Array of SIPs to store all the SIPs
    Plan[] public plans;

    //Kyber Network Proxy contract address to swap tokens
    KyberNetworkProxyInterface kyberNetworkProxyContract;

    constructor() public {
        owner = msg.sender;
        processors[owner] = true;
    }

    //Events
    event newSIPCreated(uint id, address indexed srcAccount);
    // SIPUpdated();
    // installmentReceived();
    event tokensSwapped(
        address indexed srcAccount,
        ERC20 srcToken,
        address indexed destAccount,
        ERC20 destToken,
        uint srcQty);

    function createSIP( address payable srcAccount,
                        address payable destAccount,
                        address srcToken,
                        address destToken,
                        uint period,
                        uint amount
                    ) public returns (uint) {

        uint planId = totalSIPCount++;

        plans.push(Plan(planId, srcAccount, destAccount, srcToken, destToken, period, Status.active, amount, now));

        userSIPCount[srcAccount]++;
        idToAddress[planId] = srcAccount;
        totalSIPCount++;

        emit newSIPCreated(planId, srcAccount);
    }

    // function processMultipleSIPs(uint[] memory planIDs) public {

    //     //Check if msg.sender is a valid processor
    //     require(processors[msg.sender], "Only valid processors can trigger installments");

    //     for(uint i = 0; i < planIDs.length; i++ ) {
    //         Plan memory userPlan = plans[i];
    //         executeSwap( ERC20(userPlan.srcToken),
    //                      userPlan.amount,
    //                      ERC20(userPlan.destToken),
    //                      userPlan.destAccount,
    //                     1e18);
    //     }
    // }

    function processSingleSIP(uint sipID) public {
        // require(processors[msg.sender], "Only valid processors can trigger installments");

        Plan memory userPlan = plans[sipID];
        swapTokensUsingKyber(
            userPlan.srcAccount,
            ERC20(userPlan.srcToken),
            userPlan.destAccount,
            ERC20(userPlan.destToken),
            userPlan.amount,
            100 * 1e18);
    }

    function pauseSIP(uint id) public returns (bool) {
        require(msg.sender == plans[id].srcAccount, "Not authorized to change SIP status");

        require(plans[id].status == Status.active, "Plan not active");

        //Pause the status of SIP
        plans[id].status = Status.paused;
    }

/*
*******************************************************************************
* Kyber Network contract functions
/******************************************************************************
*/
    function setKyberNetworkProxyContract(address contractAddress) public returns (bool) {
        require(msg.sender == owner, "Not authorized to call this function");
        kyberNetworkProxyContract = KyberNetworkProxyInterface(contractAddress);
    }

    function swapTokensUsingKyber(
        address srcAccount,
        ERC20 srcToken,
        address destAccount,
        ERC20 destToken,
        uint srcQty,
        uint maxDestAmount
    ) public {

        uint minConversionRate;
        require(srcToken.transferFrom(
            srcAccount,
            address(this),
            srcQty),
            "Transfer of token from user account failed"
        );

        // Mitigate ERC20 Approve front-running attack, by initially setting allowance to 0
        require(srcToken.approve(address(kyberNetworkProxyContract), 0), "Error approving allowance");
        require(srcToken.approve(address(kyberNetworkProxyContract), srcQty), "Error approving allowance");

        // Get the minimum conversion rate
        (minConversionRate,) = kyberNetworkProxyContract.getExpectedRate(srcToken, destToken, srcQty);

        // Swap the ERC20 token and send to destAddress
        kyberNetworkProxyContract.trade(
            srcToken,
            srcQty,
            destToken,
            destAccount,
            maxDestAmount,
            minConversionRate,
            owner
        );

        // Log the event
        emit tokensSwapped(srcAccount, srcToken, destAccount, destToken, srcQty);
    }

}