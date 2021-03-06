const CapitalETH = artifacts.require("CapitalETH");
const ERC20 = artifacts.require("ERC20");

contract("CapitalETH", (accounts) => {

    let [alice, bob, charlie] = accounts;
    const ethAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';        
    const daiAddress = '0xaD6D458402F60fD3Bd25163575031ACDce07538D';    //Ropsten
    const batAddress = '0xDb0040451F373949A4Be60dcd7b6B8D6E42658B6';     //Ropsten
    const kyberAddress = '0x818E6FECD516Ecc3849DAf6845e3EC868087B755';      //Ropsten

    const BN = web3.utils.BN;
    const oneTokenInDecimals = (new BN(10).pow(new BN(18)));

    let contractInstance;
    beforeEach(async () => {
        contractInstance = await CapitalETH.new();
    });

    context("should be able to create and process a SIP", async () => {
        it("should be able to create a SIP", async () => {

            const result = await contractInstance.createSIP(
                alice, bob, ethAddress, daiAddress, 100, oneTokenInDecimals, {from: alice});
    
            assert(result.receipt.status, true);
            // console.log(result.log[0]);     
        })

        xit("should be able to process a SIP", async () => {
        });
    })


    context("should be able to exchange tokens using Kyber", async() => {

        it("should be able to set Kyber Network Proxy contract", async () => { 
             
            const result = await contractInstance.setKyberNetworkProxyContract(kyberAddress);
            console.log(result);
            assert(result.receipt.status, true);

        })

        it("should be able to swap DAI for BAT", async () => {

            let daiToken = await ERC20.at('0xaD6D458402F60fD3Bd25163575031ACDce07538D');
            let batToken = await ERC20.at('0xDb0040451F373949A4Be60dcd7b6B8D6E42658B6');

            const srcTokens = new BN(100).mul(oneTokenInDecimals);

            //Approve contract to spend alice's dai balance
            await daiToken.approve(contractInstance.address, srcTokens, {from: alice});

            const result = await contractInstance.swapTokensUsingKyber( 
                alice,
                daiAddress,
                alice,
                batAddress,
                oneTokenInDecimals,
                new BN(100).mul(oneTokenInDecimals)
            );

            assert(result.receipt.status, true);

        })

    })

    context("should be able to return multiple SIPs", async () => {
        it("should be able to create multiple SIP", async () => {

            let result = await contractInstance.createSIP(
                alice, alice, daiAddress, batAddress, 100, oneTokenInDecimals, {from: alice});   
            assert(result.receipt.status, true);    

            result = await contractInstance.createSIP(
                alice, bob, daiAddress, batAddress, 100, oneTokenInDecimals, {from: alice});   
            assert(result.receipt.status, true);

            result = await contractInstance.createSIP(
                alice, charlie, daiAddress, batAddress, 100, oneTokenInDecimals, {from: alice});   
            assert(result.receipt.status, true);
        })

        it("should be able to return an array of SIPs for an Address", async () => {

            const res = await contractInstance.getPlansByAddress(alice);
            // assert(res.receipt.status, true);
            console.log(res);
        });
    })
    
})