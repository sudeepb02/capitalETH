import React from 'react'
import { Steps, Divider } from 'antd'
import './Home.css'
// import 'antd/dist/antd.css'
// import { getPrices } from '../utils/stats'

function Home() {
  const { Step } = Steps

  return (
    <div className="main-container">
      <h1 className="highlight-color">Welcome to capitalETH</h1>
      <h2 className="highlight-color">
        A smart and hassle-free way to invest in cryptocurrencies
        <br />
        <br />
      </h2>
      <p>
        Create a plan to invest small amounts regularly to achieve your goal all
        while reducing the risk of buying at a high-price and reap the benefits
        of compounding.
      </p>
      <h3>
        If you invested <span className="highlight-color">$100</span> every
        month in <span className="highlight-color">ETH</span> for the last{' '}
        <span className="highlight-color">1 year</span>,<br /> you would've got
        <span className="highlight-color"> returns of 200% **</span>
      </h3>
      <hr />
      <br />
      <div>Creating a plan is super-easy</div>
      <div className="steps-container">
        <ul className="progressbar">
          <li className="active">Select Tokens</li>
          <li className="active">Select Amount & Frequency</li>
          <li className="active">Relax!!!</li>
          <li className="active">
            Installment is processed and you receive destination tokens
          </li>
        </ul>
      </div>
      <br />
      <br />
      <br />
      <br />

      <hr />

      <div>
        <h2 className="highlight-color">How it works?</h2>
        <br />
      </div>

      <div className="container-left">
        <ul class="vertical-steps">
          <li>
            <p></p>
            <span>
              <strong>Select plan details</strong>
              While creating a plan, destination token, amount and other details
              are selected
            </span>
          </li>
          <li>
            <p></p>
            <span>
              <strong>Approve Source tokens</strong>
              Approve source tokens to be used to buy destination tokens
            </span>
          </li>
          <li>
            <p></p>
            <span>
              <strong>Create a new Goal/Plan</strong>A new plan is created and
              marked active
            </span>
          </li>
          <li>
            <p></p>
            <span>
              <strong>All active plans are displayed</strong>
              Anyone can view the active plans in the Process page
            </span>
          </li>
          <li>
            <p></p>
            <span>
              <strong>installment is processed</strong>
              Processors process the installment and pay gas for the transaction
            </span>
          </li>
          <li>
            <p></p>
            <span>
              <strong>Receive destination Tokens in your wallet</strong>
              You receive destination tokens in your wallet and a nominal fee is
              paid to the processor
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Home
