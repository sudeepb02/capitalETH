import React, { useContext, useState, useEffect } from 'react'
import { Web3Context } from './Web3Context'
import CapitalETH from '../abis/CapitalETH.json'
import { ProcessSIPPlan } from './ProcessSIPPlan'
import './Dashboard.css'

const Process = () => {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)
  const CAPITAL_ETH_ROPSTEN = '0xF1Cd333AD3306e9B8A4fBF29b435Fe5931bE5f06'
  const CAPITAL_ETH_LOCAL = '0x0Eb8dCf3034d1fD26fd22E1BC787aCA7b4a51b87'

  const [plans, setPlans] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (account === '') {
      setIsConnected(false)
    } else {
      setIsConnected(true)
      fetchPlans()
    }
  }, [account])

  const fetchPlans = async () => {
    const capitalETHInstance = new web3.eth.Contract(
      CapitalETH.abi,
      CAPITAL_ETH_ROPSTEN,
    )

    const totalSIPCount = await capitalETHInstance.methods
      .totalSIPCount()
      .call()
    // console.log(totalSIPCount)

    let userPlan
    for (let index = 0; index < totalSIPCount; index++) {
      userPlan = await capitalETHInstance.methods.plans(index).call()
      // console.log(userPlan)
      setPlans((prevPlans) => [...prevPlans, userPlan])
    }
  }

  return (
    <div>
      <h1>Process SIPs</h1>
      {isConnected ? (
        <div className="plans-container">
          {plans.map((plan) => (
            <ProcessSIPPlan data={plan} key={plan.id} />
          ))}
        </div>
      ) : (
        <p>Please connect to web3 to view your dashboard</p>
      )}
    </div>
  )
}

export default Process
