import React, { useState, useContext } from 'react'
import Select from 'react-select'
import './SIPPlan.css'
import CapitalETH from '../abis/CapitalETH.json'
import ERC20 from '../abis/ERC20.json'
import { Web3Context } from './Web3Context'
import { SRC_TOKENS_ROPSTEN, DEST_TOKENS_ROPSTEN } from '../utils/tokenAddress'

export const NewSIPPlan = () => {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)
  const CAPITAL_ETH_LOCAL = '0x0Eb8dCf3034d1fD26fd22E1BC787aCA7b4a51b87'
  const CAPITAL_ETH_ROPSTEN = '0xF1Cd333AD3306e9B8A4fBF29b435Fe5931bE5f06'
  const [destAccount, setDestAccount] = useState('')
  const [srcToken, setSrcToken] = useState('')
  const [destToken, setDestToken] = useState('')
  const [amount, setAmount] = useState('')
  const [period, setPeriod] = useState('')
  const BN = web3.utils.BN
  const ONE_TOKEN = new BN(10).pow(new BN(18))

  const updateDestAccount = (e) => {
    setDestAccount(e.target.value)
  }

  const updateSrcToken = (inputValue) => {
    setSrcToken(inputValue.value)
  }

  const updateDestToken = (inputValue) => {
    setDestToken(inputValue.value)
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

  const triggerApprove = (e) => {
    e.preventDefault()
    approveToken()
  }

  const approveToken = async () => {
    const ERC20Instance = new web3.eth.Contract(ERC20.abi, srcToken)

    const accounts = await web3.eth.getAccounts()

    const txStatus = await ERC20Instance.methods
      .approve(CAPITAL_ETH_ROPSTEN, new BN(1000).mul(ONE_TOKEN))
      .send({ from: accounts[0] })
  }

  const createNewSIP = async () => {
    const capitalETHInstance = new web3.eth.Contract(
      CapitalETH.abi,
      CAPITAL_ETH_ROPSTEN,
    )

    const accounts = await web3.eth.getAccounts()

    const txStatus = await capitalETHInstance.methods
      .createSIP(
        destAccount,
        srcToken,
        destToken,
        false,
        period,
        new BN(amount).mul(ONE_TOKEN),
      )
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
        <Select options={SRC_TOKENS_ROPSTEN} onChange={updateSrcToken} />
        <br />
        <br />

        <label htmlFor="destToken">Destination Token</label>
        <Select options={DEST_TOKENS_ROPSTEN} onChange={updateDestToken} />
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

        <button onClick={triggerApprove}>Approve</button>
        <button onClick={triggerCreateSIP}>Create</button>
      </form>
    </div>
  )
}
