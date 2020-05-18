import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import Portis from '@portis/web3'
import Web3 from 'web3'
import { Web3Context } from './Web3Context'
import Login from './Login'
import './Nav.css'

function Nav() {
  // const [web3, setWeb3, account, setAccount] = useContext(Web3Context)
  // const [isConnected, setIsConnected] = useState(false)

  // const connect = async () => {
  //   if (!isConnected) {
  //     if (window.ethereum) {
  //       console.log(web3)
  //       await window.ethereum.enable()
  //       console.log('Ethereum enabled')
  //       const web3new = new Web3(window.ethereum)
  //       setWeb3(web3new)
  //       const accounts = await web3new.eth.getAccounts()
  //       setAccount(accounts[0])
  //       console.log(account)
  //       setIsConnected(true)
  //     }
  //   }
  // }

  // const connectPortis = async () => {
  //   if (!isConnected) {
  //     const portis = new Portis(
  //       'd81878e9-27e9-46d2-9c19-102c8cf1fff7',
  //       'ropsten',
  //     )
  //     const web3new = new Web3(portis.provider)
  //     console.log('Portis connected')
  //     setWeb3(web3new)
  //     const accounts = await web3new.eth.getAccounts()
  //     setAccount(accounts[0])
  //     console.log(account)
  //     setIsConnected(true)
  //   }
  // }

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
        <Login />
      </ul>
    </nav>
  )
}

export default Nav
