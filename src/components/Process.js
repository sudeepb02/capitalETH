import React, { useContext, useState, useEffect } from 'react'
import { Web3Context } from './Web3Context'
import { CAPITALETH_ROPSTEN } from '../utils/deployedAddress'
import CapitalETH from '../abis/CapitalETH.json'
import { ProcessSIPPlan } from './ProcessSIPPlan'
import './Dashboard.css'

const Process = () => {
  const [web3, setWeb3, account, setAccount] = useContext(Web3Context)

  const [plans, setPlans] = useState([])
  const [planFee, setPlanFee] = useState([])
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
      CAPITALETH_ROPSTEN,
    )

    const totalSIPCount = await capitalETHInstance.methods
      .totalSIPCount()
      .call()
    // console.log(totalSIPCount)
    var currentTime = Math.round(new Date().getTime() / 1000)
    console.log(currentTime)

    let userPlan
    let processorFee
    for (let index = 0; index < totalSIPCount; index++) {
      userPlan = await capitalETHInstance.methods.plans(index).call()
      // console.log(userPlan)
      var readyTime = parseInt(userPlan.lastTx) + parseInt(userPlan.frequency)
      if (userPlan.isActive && readyTime < currentTime) {
        console.log("CurrentTime : ", currentTime)
        console.log("Plan ready at: ", readyTime)
        //  && userPlan.lastTx + userPlan.frequency < currentTime - Commented for demo
        setPlans((prevPlans) => [...prevPlans, userPlan])
        processorFee = await capitalETHInstance.methods
          .calculateProcessorFee(userPlan.amount)
          .call()

        setPlanFee((prevFees) => [...prevFees, processorFee])
      }
    }
  }

  return (
    <div className="main-container">
      <div className="container-left">
        <h1 className="highlight-color">Process Plans</h1>
        <h3 className="highlight-color">
          Process installments of other users and collect fees
        </h3>
        <hr />
        <h2 className="highlight-color">Available Plans</h2>
        <hr />
        {isConnected ? (
          <div className="plans-container">
            {plans.length == 0 ? (
              <p>No plans available at the moment</p>
            ) : (
              plans.map((plan, idx) => (
                <ProcessSIPPlan
                  data={plan}
                  key={plan.id}
                  processorFee={planFee[idx]}
                />
              ))
            )}
          </div>
        ) : (
          <p>Please connect to a web3 provider</p>
        )}
      </div>
    </div>
  )
}

export default Process
