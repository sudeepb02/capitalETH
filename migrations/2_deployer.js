var CapitalETH = artifacts.require('./CapitalETH.sol')

module.exports = async function (deployer, network) {
  deployer.deploy(CapitalETH)
}
