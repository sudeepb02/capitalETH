import React, { useContext, useState, useEffect } from 'react'
import { Web3Context } from './Web3Context'
import { CAPITALETH_ROPSTEN } from '../utils/deployedAddress'
import CapitalETH from '../abis/CapitalETH.json'
import { SIPPlan } from './SIPPlan'
import { NewSIPPlan } from './NewSIPPlan'
import './Dashboard.css'

function Dashboard() {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)

  const [activePlans, setActivePlans] = useState([])
  const [inactivePlans, setInactivePlans] = useState([])
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
      CAPITALETH_ROPSTEN,
    )

    const userPlanIDs = await capitalETHInstance.methods
      .getPlansByAddress(account)
      .call()

    let userPlan
    userPlanIDs.map(async (planID) => {
      userPlan = await capitalETHInstance.methods.plans(planID).call()
      // console.log(userPlan)
      if (userPlan.isActive) {
        setActivePlans((prevPlans) => [...prevPlans, userPlan])
      } else {
        setInactivePlans((prevPlans) => [...prevPlans, userPlan])
      }
    })
  }

  return (
    <div className="main-container">
      <div className="container-left">
        <h1 className="highlight-color">Dashboard</h1>
        <h3 className="highlight-color">
          Create a new goal plan and view/update existing plans
        </h3>
        <hr />
        {isConnected ? (
          <div>
            <h2 className="highlight-color">Active Plans</h2>
            <hr />
            <div className="plans-container">
              <NewSIPPlan />
              {activePlans.length == 0 ? (
                <p>You don't have any active plans</p>
              ) : (
                activePlans.map((plan) => <SIPPlan data={plan} key={plan.id} />)
              )}
            </div>
            <hr />
            <h2 className="highlight-color">Inactive Plans</h2>
            <hr />
            <div className="plans-container">
              {inactivePlans.length == 0 ? (
                <p>You don't have any inactive plans</p>
              ) : (
                inactivePlans.map((plan) => (
                  <SIPPlan data={plan} key={plan.id} />
                ))
              )}
            </div>
          </div>
        ) : (
          <p>Please connect to web3 to view your dashboard</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
