import React, { useState, useContext } from 'react'
import Select from 'react-select'
import Modal from 'react-modal'
import { useAlert } from 'react-alert'
import './SIPPlan.css'
import { CAPITALETH_ROPSTEN } from '../utils/deployedAddress'
import CapitalETH from '../abis/CapitalETH.json'
import ERC20 from '../abis/ERC20.json'
import { Web3Context } from './Web3Context'
import { SRC_TOKENS_ROPSTEN, DEST_TOKENS_ROPSTEN } from '../utils/tokenAddress'

Modal.setAppElement('#root')

export const NewSIPPlan = () => {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)

  const [destAccount, setDestAccount] = useState('')
  const [srcToken, setSrcToken] = useState('')
  const [destToken, setDestToken] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)

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

  const convertDaysToSeconds = (days) => {
    var secondsInADay = 60 * 60 * 24
    return days * secondsInADay
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

  const createNewSIP = async () => {
    const capitalETHInstance = new web3.eth.Contract(
      CapitalETH.abi,
      CAPITALETH_ROPSTEN,
    )

    const accounts = await web3.eth.getAccounts()

    var freq = convertDaysToSeconds(frequency)

    const txStatus = await capitalETHInstance.methods
      .createSIP(
        destAccount,
        srcToken,
        destToken,
        false,
        freq,
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
              onClick: () => {
                window.open(url, '_blank')
              },
            },
          ],
        })
        setModalIsOpen(false)
      })
      .on('receipt', function () {
        alert.success('Transaction successful!')
      })
  }

  return (
    <div>
      <div className="plan" onClick={() => setModalIsOpen(true)}>
        <h3 className="highlight-color">Create a new Plan</h3>
        <h3 className="highlight-color">OR</h3>
        <h3 className="highlight-color">Set a Goal</h3>
      </div>
      <div className="highlight-color">
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="create-modal"
          overlayClassName="create-overlay-modal"
        >
          <h2 className="highlight-color">Set a Goal</h2>
          <hr />
          <br />
          <form>
            <span className="highlight-color">I would like to invest</span>
            <br />
            <span className="highlight-color">amount </span>
            <input
              type="text"
              name="amount"
              value={amount}
              onChange={updateAmount}
              placeholder="ex. 100"
            />
            <Select
              options={SRC_TOKENS_ROPSTEN}
              onChange={updateSrcToken}
              className="select-token"
            />
            <br />
            <span className="highlight-color">every </span>
            <input
              type="text"
              name="frequency"
              value={frequency}
              placeholder="ex. 30"
              onChange={updateFrequency}
            />{' '}
            <span className="highlight-color"> days</span>
            <br />
            <span className="highlight-color">to buy token </span>
            <Select
              options={DEST_TOKENS_ROPSTEN}
              onChange={updateDestToken}
              className="select-token"
            />
            <br />
            <span className="highlight-color">
              Deposit the tokens bought to address
            </span>
            <input
              type="text"
              name="destAccount"
              value={destAccount}
              onChange={updateDestAccount}
              placeholder="0x....."
            />
          </form>
          <button onClick={triggerApprove}>Approve</button>
          <button onClick={triggerCreateSIP}>Create</button>
          <button onClick={() => setModalIsOpen(false)}>Close</button>
        </Modal>
      </div>
    </div>
  )
}
