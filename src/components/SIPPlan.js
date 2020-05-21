import React from 'react'
import Address from './Address'
import './SIPPlan.css'

export function SIPPlan(props) {
  return (
    <div className="plan">
      <p>Plan ID: {props.data.id}</p>
      <p>Status: {props.data.status}</p>
      <p>
        Source Account: <Address value={props.data.srcAccount} size="short" />
      </p>
      <p>
        Destination Account:
        <Address value={props.data.destAccount} size="short" />
      </p>
      <p>Source Token: {props.data.srcToken}</p>
      <p>Destination Token: {props.data.destToken}</p>
      <p>Amount: {props.data.amount}</p>
      <p>Period: {props.data.period}</p>
    </div>
  )
}
