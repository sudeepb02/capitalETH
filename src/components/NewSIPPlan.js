import React, { useState, useContext } from 'react'
import './SIPPlan.css'
import CapitalETH from '../abis/CapitalETH.json'
import { Web3Context } from './Web3Context'

export const NewSIPPlan = () => {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)
  const CAPITAL_ETH_LOCAL = '0x0Eb8dCf3034d1fD26fd22E1BC787aCA7b4a51b87'
  const CAPITAL_ETH_ROPSTEN = '0x0675b056FD826aFa78B11776E18E9e4b9d4eF4B6'
  const [destAccount, setDestAccount] = useState('')
  const [srcToken, setSrcToken] = useState('')
  const [destToken, setDestToken] = useState('')
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState('')

  const updateDestAccount = (e) => {
    setDestAccount(e.target.value)
  }

  const updateSrcToken = (e) => {
    setSrcToken(e.target.value)
  }

  const updateDestToken = (e) => {
    setDestToken(e.target.value)
  }

  const updateAmount = (e) => {
    setAmount(e.target.value)
  }

  const updatePeriod = (e) => {
    setPeriod(e.target.value)
  }

  const triggerCreateSIP = (e) => {
    e.preventDefault()
    createNewSIP()
  }

  const createNewSIP = async () => {
    const capitalETHInstance = new web3.eth.Contract(
      CapitalETH.abi,
      CAPITAL_ETH_ROPSTEN,
    )

    const accounts = await web3.eth.getAccounts()

    const txStatus = await capitalETHInstance.methods
      .createSIP(accounts[0], destAccount, srcToken, destToken, period, amount)
      .send({ from: accounts[0] })
  }

  return (
    <div className="plan">
      <form>
        <label htmlFor="destAccount">Destination Account</label>
        <input
          type="text"
          name="destAccount"
          value={destAccount}
          onChange={updateDestAccount}
        />
        <br />
        <br />

        <label htmlFor="srcToken">Source Token</label>
        <input
          type="text"
          name="srcToken"
          value={srcToken}
          onChange={updateSrcToken}
        />
        <br />
        <br />

        <label htmlFor="destToken">Destination Token</label>
        <input
          type="text"
          name="destToken"
          value={destToken}
          onChange={updateDestToken}
        />
        <br />
        <br />

        <label htmlFor="amount">Amount</label>
        <input
          type="text"
          name="amount"
          value={amount}
          onChange={updateAmount}
        />
        <br />
        <br />

        <label htmlFor="period">Period</label>
        <input
          type="text"
          name="period"
          value={period}
          onChange={updatePeriod}
        />
        <br />
        <br />

        <button onClick={triggerCreateSIP}>Create</button>
      </form>
    </div>
  )
}
