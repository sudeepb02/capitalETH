import React from 'react'
import './Footer.css'
import ethereum from '../assets/ethereum-logo.png'

const Footer = () => {
  return (
    <footer>
      <p>
        capitalETH | <img src={ethereum} alt="Ethereum" /> Powered by Ethereum
      </p>
      <br />
    </footer>
  )
}

export default Footer
