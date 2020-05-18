import React, { useState, useContext } from 'react'
import Modal from 'react-modal'
import Portis from '@portis/web3'
import Web3 from 'web3'
import { Web3Context } from './Web3Context'
import './Nav.css'
import './Login.css'
import metamasklogo from '../assets/metamask-logo.png'
import portislogo from '../assets/portis-logo.png'

Modal.setAppElement('#root')

const Login = () => {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)
  const [isConnected, setIsConnected] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const connectMetamask = async () => {
    if (!isConnected) {
      if (window.ethereum) {
        await window.ethereum.enable()
        const web3new = new Web3(window.ethereum)
        setWeb3(web3new)
        const accounts = await web3new.eth.getAccounts()
        setAccount(accounts[0])
        setIsConnected(true)
        setModalIsOpen(false)
      }
    }
  }

  const connectPortis = async () => {
    if (!isConnected) {
      const portis = new Portis(
        'd81878e9-27e9-46d2-9c19-102c8cf1fff7',
        'ropsten',
      )
      const web3new = new Web3(portis.provider)
      setWeb3(web3new)
      const accounts = await web3new.eth.getAccounts()
      setAccount(accounts[0])
      setIsConnected(true)
      setModalIsOpen(false)
    }
  }

  return (
    <div>
      <button className="connect-button" onClick={() => setModalIsOpen(true)}>
        {isConnected ? 'Connected' : 'Connect'}
      </button>
      <Modal
        className="login-modal"
        overlayClassName="login-overlay-modal"
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <h3>Connect to web3</h3>
        <div className="web3-container">
          <div className="web3-box" onClick={connectPortis}>
            <img src={portislogo} alt="Portis" />
            <div className="container">
              <button className="login-button" onClick={connectPortis}>
                Portis
              </button>
              <p>I like it simple!</p>
            </div>
          </div>

          <div className="web3-box" onClick={connectMetamask}>
            <img src={metamasklogo} alt="Metamask" />
            <div className="container">
              <button className="login-button" onClick={connectMetamask}>
                Metamask
              </button>
              <p>Bring it On!!!</p>
            </div>
          </div>
        </div>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  )
}
export default Login
