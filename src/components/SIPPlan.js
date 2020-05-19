import React from 'react'
import './SIPPlan.css'

export function SIPPlan(props) {
  return (
    <div className="plan">
      <p>Plan ID: {props.data.id}</p>
      <p>Status: {props.data.status}</p>
      <p>Source Account: {props.data.srcAccount}</p>
      <p>Destination Account: {props.data.destAccount}</p>
      <p>Source Token: {props.data.srcToken}</p>
      <p>Destination Token: {props.data.destToken}</p>
      <p>Amount: {props.data.amount}</p>
      <p>Period: {props.data.period}</p>
    </div>
  )
}
