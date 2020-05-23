import React, { useContext } from 'react'
import Address from './Address'
import { Web3Context } from './Web3Context'
import { addressToTicker } from '../utils/tokenAddress'
import { CAPITALETH_ROPSTEN } from '../utils/deployedAddress'
import CapitalETH from '../abis/CapitalETH.json'
import './SIPPlan.css'

export function SIPPlan(props) {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)
  const BN = web3.utils.BN
  const ONE_TOKEN = new BN(10).pow(new BN(18))
  const convertTokenAmount = (amount) => {
    let numberOfTokens = new BN(amount).div(ONE_TOKEN)
    return numberOfTokens.toString()
  }

  const capitalETHInstance = new web3.eth.Contract(
    CapitalETH.abi,
    CAPITALETH_ROPSTEN,
  )

  const pausePlan = async () => {
    await capitalETHInstance.methods
      .pauseSIP(props.data.id)
      .send({ from: account })
      .on('receipt', function () {
        alert.success('Plan paused successfully!')
      })
  }

  const resumePlan = async () => {
    await capitalETHInstance.methods
      .resumeSIP(props.data.id)
      .send({ from: account })
      .on('receipt', function () {
        alert.success('Plan activated successfully!')
      })
  }

  const convertUnixTimeToDays = (unixTime) => {
    const secondsInADay = 60 * 60 * 24
    return (unixTime / secondsInADay).toFixed(2)
  }

  return (
    <div className="plan">
      <h2>
        Invest{' '}
        <span>
          {convertTokenAmount(props.data.amount)}{' '}
          {addressToTicker(props.data.srcToken)}{' '}
        </span>
      </h2>
      <h2>
        every <span>{convertUnixTimeToDays(props.data.frequency)} days </span>
      </h2>
      <h2>
        to buy Token <span>{addressToTicker(props.data.destToken)}</span>.{' '}
      </h2>
      <h2>Deposit tokens to address </h2>
      <h2>
        {' '}
        <span>
          <Address value={props.data.destAccount} size="short" />
        </span>
      </h2>
      <h2>
        Earn interest: <span>{props.data.interestEnabled ? 'Yes' : 'No'}</span>
      </h2>
      {props.data.isActive ? (
        <button onClick={pausePlan}>Pause Plan</button>
      ) : (
        <button onClick={resumePlan}>Activate Plan</button>
      )}
    </div>
  )
}
