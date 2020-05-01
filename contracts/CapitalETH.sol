pragma solidity ^0.6.0;

contract CapitalETH {

    address payable public owner;

    mapping (address => bool) public processors;        //Mapping of all valid SIP processors
    mapping (address => uint) public userSIPCount;      //Mapping of Address to SIP count
    mapping (uint => address) public idToAddress;       //Mapping of SIP id to user address

    enum Status{ active, paused }
    uint totalSIPCount;

    constructor() public {
        owner = msg.sender;
        processors[owner] = true;
    }

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

    //Events
    event newSIPCreated(uint id, address indexed srcAccount);
    // SIPUpdated();
    // installmentReceived();

    function createSIP( address payable srcAccount,
                        address payable destAccount,
                        address srcToken,
                        address destToken,
                        uint period,
                        uint amount
                    ) public returns (uint) {

        uint planId = totalSIPCount++;

        plans.push( Plan(planId,
                         srcAccount,
                         destAccount,
                         srcToken,
                         destToken,
                         period,
                         Status.active,
                         amount,
                         now));

        userSIPCount[srcAccount]++;
        idToAddress[planId] = srcAccount;
        totalSIPCount++;

        emit newSIPCreated(planId, srcAccount);
    }

    // function processSIPs(uint[] memory planIDs) public {

    //     //Check if msg.sender is a valid processor
    //     require(processors[msg.sender], "Only valid processors can trigger installments");

    //     for(uint i = 0; i < planIDs.length; i++ ) {
    //         // Plan memory userPlan = plans[i];
    //     }
    // }

    function pauseSIP(uint id) public returns (bool) {
        require(msg.sender == plans[id].srcAccount, "Not authorized to change SIP status");

        require(plans[id].status == Status.active, "Plan not active");

        //Pause the status of SIP
        plans[id].status = Status.paused;
    }

}