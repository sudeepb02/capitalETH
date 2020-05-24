pragma solidity ^0.6.0;


import "./KyberNetworkProxy.sol";
import "./ILendingPool.sol";
import "./ILendingPoolAddressesProvider.sol";
import "./ATokenInterface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract CapitalETH is Ownable {

    using SafeMath for uint256;

    //Structure of the SIP Plan
    struct Plan {

        uint id;            //Unique ID of SIP

        address payable srcAccount;         //Wallet address from where source token will be debited
        address payable destAccount;        //Wallet address where the destination token will be deposited

        address srcToken;           //Address of source Token (ERC20)
        address destToken;          //Address of destination Token (ERC20)

        bool isActive;              //Status of the investment plan
        bool interestEnabled;       //Enabled if interest bearing ATokens is enabled
        uint frequency;             //Time between installments
        uint amount;                //Amount in Tokens to be deducted at every installment  (18 decimals)

        uint createdAt;     //Timestamp when the plan was created
        uint lastTx;        //Timestamp of the last transaction
    }

    //Array of SIPs to store all the SIPs
    Plan[] public plans;

    mapping(address => bool) public processors;        //Mapping of all valid SIP processors
    mapping(address => uint) public userSIPCount;      //Mapping of Address to SIP count
    mapping(uint => address) public idToAddress;       //Mapping of SIP id to user address

    uint public totalSIPCount;

    //Kyber Network Proxy contract address to swap tokens
    KyberNetworkProxyInterface public kyberNetworkProxyContract;

    //Aave Lending Pool contract Address
    uint16 public aaveRef;
    ILendingPoolAddressesProvider public aaveAddressProvider;
    ILendingPool public aaveLendingPool;

    //Events
    event newSIPCreated(
        uint id,
        address indexed srcAccount,
        address indexed destAccount,
        address srcToken,
        address destToken,
        uint amount
    );

    // SIPUpdated();
    // installmentReceived();
    event updateKyberNetworkProxyContract(
        address indexed oldAddress, 
        address indexed newContractAddress
    );

    event tokensSwapped(
        address indexed srcAccount,
        ERC20 srcToken,
        address indexed destAccount,
        ERC20 destToken,
        uint srcQty
    );

    receive() external payable { }
    fallback() external payable { }

    constructor() public {
        processors[msg.sender] = true;
        totalSIPCount = 0;
    }

    function createSIP(
        address payable destAccount,
        address srcToken,
        address destToken,
        bool interestEnabled,
        uint frequency,
        uint amount
    ) 
        public 
        returns (uint)
    {
        uint planId = totalSIPCount;

        if (interestEnabled) {
            //Get ATokens for srcToken and transfer them to user address
            address aTokenAddress = getInterestBearingATokens(
                srcToken,
                amount,
                aaveRef
            );
            srcToken = aTokenAddress;
        }

        plans.push(Plan(
            planId,
            msg.sender,
            destAccount, 
            srcToken, 
            destToken,
            true,
            interestEnabled,
            frequency,
            amount,
            now,
            now
        ));

        userSIPCount[msg.sender]++;
        idToAddress[planId] = msg.sender;
        totalSIPCount++;

        emit newSIPCreated(
            planId,
            msg.sender,
            destAccount,
            srcToken,
            destToken,
            amount
        );
        return planId;
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

        //Check if plan is available for processing - Commented for demo video
        // require((userPlan.lastTx + userPlan.frequency) < now, "Plan not ready for processing");
        address srcAccount = userPlan.srcAccount;
        uint processorFee = calculateProcessorFee(userPlan.amount);

        //Check if interesEnabled
        if (userPlan.interestEnabled) {

            ERC20(userPlan.srcToken).transferFrom(
                srcAccount,
                address(this),
                userPlan.amount
            );       
            //Redeem underlying tokens. The underlying token is transferred to this contract
            AToken(userPlan.srcToken).redeem(userPlan.amount);

            //Get underlying token address
            address underlyingToken = AToken(userPlan.srcToken).underlyingAssetAddress();
            ERC20(underlyingToken).approve(address(this), userPlan.amount);
            srcAccount = address(this);            
        }

        uint finalAmount = (userPlan.amount).sub(processorFee);

        swapTokensUsingKyber(
            srcAccount,
            ERC20(userPlan.srcToken),
            userPlan.destAccount,
            ERC20(userPlan.destToken),
            finalAmount,
            10 * userPlan.amount
        );

        ERC20(userPlan.srcToken).transferFrom(srcAccount, msg.sender, processorFee);
    }

    function pauseSIP(uint id) public {
        require(msg.sender == plans[id].srcAccount, "Not authorized to change SIP status");
        require(plans[id].isActive, "Plan not active");
        plans[id].isActive = false;
    }

    function resumeSIP(uint id) public {
        require(msg.sender == plans[id].srcAccount, "Not authorized to change SIP status");
        require(!plans[id].isActive, "Plan already active");
        plans[id].isActive = true;
    }

    function calculateProcessorFee(uint amount) public pure returns (uint) {
        uint processorFeePercent = 1e16;        //1 percent
        uint oneToken = 1e18;
        if (amount < oneToken.mul(100)) {
            return oneToken;                     //If amount is less than 100 DAI, fixed fee of 1 DAI
        } else {
            return amount.mul(processorFeePercent);
        }
    }

    function getPlansByAddress(
        address srcAddress
    )
        public
        view
        returns (uint[] memory) 
    {
        uint[] memory result = new uint[](userSIPCount[srcAddress]);
        uint index = 0;
        for (uint i = 0; i < plans.length; i++) {
            if (idToAddress[i] == srcAddress) {
                result[index] = i;
                index++;
            }
        }
        return result;
    }

/*
*******************************************************************************
* Kyber Network contract functions
/******************************************************************************
*/
    function setKyberNetworkProxyContract(
        address newContractAddress
    )
        public
        onlyOwner
        returns (bool)
    {
        address oldAddress = address(kyberNetworkProxyContract);
        kyberNetworkProxyContract = KyberNetworkProxyInterface(newContractAddress);
        emit updateKyberNetworkProxyContract(oldAddress, newContractAddress);
        return true;
    }

    function swapTokensUsingKyber(
        address srcAccount,
        ERC20 srcToken,
        address destAccount,
        ERC20 destToken,
        uint srcQty,
        uint maxDestAmount
    )
        public
    {
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
            address(0)
        );

        // Log the event
        emit tokensSwapped(srcAccount, srcToken, destAccount, destToken, srcQty);
    }

/*
*******************************************************************************
* Aave contract functions
/******************************************************************************
*/
    function setAaveAddress(
        address lendingPoolAddressProvider
    )
        public
        onlyOwner
        returns (bool)
    {
        aaveAddressProvider = ILendingPoolAddressesProvider(lendingPoolAddressProvider);
        aaveLendingPool = ILendingPool(aaveAddressProvider.getLendingPool());
    }

    function getInterestBearingATokens(
        address srcToken,
        uint amount,
        uint16 ref
    ) 
        public
        returns (address)
    {
        //Transfer source token from user to this contract
        ERC20(srcToken).transferFrom(msg.sender, address(this), amount);

        ERC20(srcToken).approve(aaveAddressProvider.getLendingPoolCore(), amount);

        //Deposits the source Tokens from contract and returns aTokens
        aaveLendingPool.deposit(srcToken, amount, ref);

        address aTokenAddress;

        //Get the aToken Address
        (, , , , , , , , , , , aTokenAddress, ) = aaveLendingPool.getReserveData(srcToken);

        require(ERC20(aTokenAddress).approve(address(this), amount), "Error approving");
        require(ERC20(aTokenAddress).transferFrom(address(this), msg.sender, amount), "Error transferring tokens");

        return aTokenAddress;
    }

    function getUnderlyingToken(
        address aTokenAddress,
        uint amount
    )
        public
        returns (address)
    {
        ERC20(aTokenAddress).transferFrom(msg.sender, address(this), amount);

        //Redeem underlying tokens. The underlying token is transferred to this contract
        AToken(aTokenAddress).redeem(amount);

        //Get underlying token address
        address underlyingToken = AToken(aTokenAddress).underlyingAssetAddress();
        ERC20(underlyingToken).approve(address(this), amount);
        ERC20(underlyingToken).transferFrom(address(this), msg.sender, amount);
        return underlyingToken;
    }
}