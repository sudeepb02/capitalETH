import React, { useState, useContext } from 'react'
import Select from 'react-select'
import { useAlert } from 'react-alert'
import './SIPPlan.css'
import { CAPITALETH_ROPSTEN } from '../utils/deployedAddress'
import CapitalETH from '../abis/CapitalETH.json'
import ERC20 from '../abis/ERC20.json'
import { Web3Context } from './Web3Context'
import { SRC_TOKENS_ROPSTEN, DEST_TOKENS_ROPSTEN } from '../utils/tokenAddress'

export const NewSIPPlan = () => {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)
  const [destAccount, setDestAccount] = useState('')
  const [srcToken, setSrcToken] = useState('')
  const [destToken, setDestToken] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState('')
  const BN = web3.utils.BN
  const ONE_TOKEN = new BN(10).pow(new BN(18))
  const alert = useAlert()

  const updateDestAccount = (e) => {
    setDestAccount(e.target.value)
  }

  //Using React select
  const updateSrcToken = (inputValue) => {
    setSrcToken(inputValue.value)
  }

  //Using React select
  const updateDestToken = (inputValue) => {
    setDestToken(inputValue.value)
  }

  const updateAmount = (e) => {
    setAmount(e.target.value)
  }

  const updateFrequency = (e) => {
    setFrequency(e.target.value)
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
      .approve(CAPITALETH_ROPSTEN, new BN(1000).mul(ONE_TOKEN))
      .send({ from: accounts[0] })
      .on('transactionHash', function (hash) {
        let url = 'https://ropsten.etherscan.io/tx/' + hash
        alert.info('Please wait while transaction is included in a block!', {
          title: 'Transaction submitted!',
          actions: [
            {
              copy: 'Check on Etherscan',
              onClick: () => { window.open(url, "_blank")},
            },
          ],
        })
      })
      .on('receipt', function () {
        alert.success('Transaction successful!')
      })
  }

  const createNewSIP = async () => {
    const capitalETHInstance = new web3.eth.Contract(
      CapitalETH.abi,
      CAPITALETH_ROPSTEN,
    )

    const accounts = await web3.eth.getAccounts()

    const txStatus = await capitalETHInstance.methods
      .createSIP(
        destAccount,
        srcToken,
        destToken,
        false,
        frequency,
        new BN(amount).mul(ONE_TOKEN),
      )
      .send({ from: accounts[0] })
      .on('transactionHash', function (hash) {
        let url = 'https://ropsten.etherscan.io/tx/' + hash
        alert.info('Please wait while transaction is included in a block!', {
          title: 'Transaction submitted!',
          actions: [
            {
              copy: 'Check on Etherscan',
              onClick: () => { window.open(url, "_blank")},
            },
          ],
        })
      })
      .on('receipt', function () {
        alert.success('Transaction successful!')
      })
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
        <Select
          options={SRC_TOKENS_ROPSTEN}
          onChange={updateSrcToken}
          className="select-token"
        />
        <br />
        <br />

        <label htmlFor="destToken">Destination Token</label>
        <Select
          options={DEST_TOKENS_ROPSTEN}
          onChange={updateDestToken}
          className="select-token"
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

        <label htmlFor="Frequency">Frequency</label>
        <input
          type="text"
          name="frequency"
          value={frequency}
          onChange={updateFrequency}
        />
        <br />
        <br />

        <button onClick={triggerApprove}>Approve</button>
        <button onClick={triggerCreateSIP}>Create</button>
      </form>
    </div>
  )
}
