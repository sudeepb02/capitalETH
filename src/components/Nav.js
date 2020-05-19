import React from 'react'
import { Link } from 'react-router-dom'
import Login from './Login'
import './Nav.css'

function Nav() {
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
