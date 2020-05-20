import React, { useContext } from 'react'
import { Web3Context } from './Web3Context'
import CapitalETH from '../abis/CapitalETH.json'
import './SIPPlan.css'

export const ProcessSIPPlan = (props) => {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)
  const CAPITAL_ETH_LOCAL = '0x0Eb8dCf3034d1fD26fd22E1BC787aCA7b4a51b87'
  const CAPITAL_ETH_ROPSTEN = '0xF1Cd333AD3306e9B8A4fBF29b435Fe5931bE5f06'

  const processSIP = async () => {
    const capitalETHInstance = new web3.eth.Contract(
      CapitalETH.abi,
      CAPITAL_ETH_ROPSTEN,
    )

    const accounts = await web3.eth.getAccounts()

    const txStatus = await capitalETHInstance.methods
      .processSingleSIP(props.data.id)
      .send({ from: accounts[0] })
  }

  return (
    <div className="plan">
      <p>Plan ID: {props.data.id}</p>
      <p>Status: {props.data.isActive ? 'Active' : 'Paused'}</p>
      <p>Source Account: {props.data.srcAccount}</p>
      <p>Destination Account: {props.data.destAccount}</p>
      <p>Source Token: {props.data.srcToken}</p>
      <p>Destination Token: {props.data.destToken}</p>
      <p>Amount: {props.data.amount}</p>
      <p>Period: {props.data.frequency}</p>
      <button onClick={processSIP}>Process SIP</button>
    </div>
  )
}
