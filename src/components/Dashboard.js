import React, { useContext, useState, useEffect } from 'react'
import { Web3Context } from './Web3Context'
import CapitalETH from '../abis/CapitalETH.json'
import { SIPPlan, NewSIPPlan } from './SIPPlan'

function Dashboard() {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)
  const CAPITAL_ETH_ROPSTEN = '0x1a00C6e0255445869C1CF1C3651085b8C8a7E27e'
  const CAPITAL_ETH_LOCAL = '0x0Eb8dCf3034d1fD26fd22E1BC787aCA7b4a51b87'

  const [plans, setPlans] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (account === '') {
      //   alert('Please connect using a Web3 provider')
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

    const userPlanIDs = await capitalETHInstance.methods
      .getPlansByAddress(account)
      .call()
    console.log(userPlanIDs)

    // setPlans(data)
    // userPlanIDs.map
    let userPlan
    userPlanIDs.map(async (planID) => {
      userPlan = await capitalETHInstance.methods.plans(planID).call()
      console.log(userPlan)
      setPlans((prevPlans) => [...prevPlans, userPlan])
    })
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {isConnected ? (
        <div>
          <NewSIPPlan />
          {plans.map((plan) => (
            <SIPPlan data={plan} key={plan.id} />
          ))}
        </div>
      ) : (
        <p>Please connect to web3 to view your dashboard</p>
      )}
    </div>
  )
}

export default Dashboard
