import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Web3 from 'web3'
import './Nav.css'
import { Web3Context } from './Web3Context'

function Nav() {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)
  const [isConnected, setIsConnected] = useState(false)

  const connect = async () => {
    if (!isConnected) {
      if (window.ethereum) {
        console.log(web3)
        await window.ethereum.enable()
        console.log('Ethereum enabled')
        const web3new = new Web3(window.ethereum)
        setWeb3(web3new)
        const accounts = await web3new.eth.getAccounts()
        setAccount(accounts[0])
        console.log(account)
        setIsConnected(true)
      }
    }
  }

  return (
    <nav>
      <div className="logo">
        <Link to="/">capitalETH</Link>
      </div>
      <ul className="nav-links">
        <Link to="/dashboard">
          <li>Dashboard</li>
        </Link>
        <Link to="/process">
          <li>Process</li>
        </Link>
        <button className="connect-button" onClick={connect}>
          {isConnected ? 'Connected' : 'Connect'}
        </button>
      </ul>
    </nav>
  )
}

export default Nav
