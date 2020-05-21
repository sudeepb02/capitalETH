import React, { useContext } from 'react'
import Address from './Address'
import { Web3Context } from './Web3Context'
import { addressToTicker } from '../utils/tokenAddress'
import './SIPPlan.css'

export function SIPPlan(props) {
  const [web3] = useContext(Web3Context)
  const BN = web3.utils.BN
  const ONE_TOKEN = new BN(10).pow(new BN(18))
  const convertTokenAmount = (amount) => {
    let numberOfTokens = new BN(amount).div(ONE_TOKEN)
    return numberOfTokens.toString()
  }

  return (
    <div className="plan">
      <p>Plan ID: {props.data.id}</p>
      <p>Status: {props.data.isActive ? 'Active' : 'Paused'}</p>
      <p>
        Source Account: <Address value={props.data.srcAccount} size="short" />
      </p>
      <p>
        Destination Account:
        <Address value={props.data.destAccount} size="short" />
      </p>
      <p>Source Token: {addressToTicker(props.data.srcToken)}</p>
      <p>Destination Token: {addressToTicker(props.data.destToken)}</p>
      <p>
        Amount: {convertTokenAmount(props.data.amount)}{' '}
        {addressToTicker(props.data.srcToken)}
      </p>
      <p>Frequency: {props.data.frequency}</p>
    </div>
  )
}
