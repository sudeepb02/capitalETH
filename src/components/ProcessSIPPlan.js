import React, { useContext } from 'react'
import { useAlert } from 'react-alert'
import { Web3Context } from './Web3Context'
import { addressToTicker } from '../utils/tokenAddress'
import { CAPITALETH_ROPSTEN } from '../utils/deployedAddress'
import CapitalETH from '../abis/CapitalETH.json'
import './SIPPlan.css'

export const ProcessSIPPlan = (props) => {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)
  const alert = useAlert()
  const BN = web3.utils.BN
  const ONE_TOKEN = new BN(10).pow(new BN(18))

  const convertTokenAmount = (amount) => {
    let numberOfTokens = new BN(amount).div(ONE_TOKEN)
    return numberOfTokens.toString()
  }

  const processSIP = async () => {
    const capitalETHInstance = new web3.eth.Contract(
      CapitalETH.abi,
      CAPITALETH_ROPSTEN,
    )

    const accounts = await web3.eth.getAccounts()

    const txStatus = await capitalETHInstance.methods
      .processSingleSIP(props.data.id)
      .send({ from: accounts[0] })
      .on('transactionHash', function (hash) {
        let url = 'https://ropsten.etherscan.io/tx/' + hash
        alert.info('Please wait while transaction is included in a block!', {
          title: 'Transaction submitted!',
          actions: [
            {
              copy: 'Check on Etherscan',
              onClick: () => {
                window.open(url, '_blank')
              },
            },
          ],
        })
      })
      .on('receipt', function () {
        alert.success('Transaction successful!')
      })
  }

  return (
    <div className="process-plan">
      <h2>Process installment of </h2>
      <h2>
        <span>
          {convertTokenAmount(props.data.amount)}{' '}
          {addressToTicker(props.data.srcToken)}
        </span>
      </h2>
      <h2>and receive</h2>
      <h2>
        <span>
          {convertTokenAmount(props.processorFee)}{' '}
          {addressToTicker(props.data.srcToken)}
        </span>
      </h2>
      <h2>in Fees</h2>
      <button onClick={processSIP}>Process SIP</button>
    </div>
  )
}
