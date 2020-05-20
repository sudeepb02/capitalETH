import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-mui'
import './App.css'
import Nav from './components/Nav'
import Dashboard from './components/Dashboard'
import Process from './components/Process'
import Home from './components/Home'
import { Web3Provider } from './components/Web3Context'

const options = {
  position: positions.MIDDLE,
}

class App extends Component {
  render() {
    return (
      <AlertProvider template={AlertTemplate} options={options}>
        <Web3Provider>
          <div>
            <Router>
              <div className="App">
                <Nav />
                <Switch>
                  <Route path="/" exact component={Home} />
                  <Route path="/dashboard" component={Dashboard} />
                  <Route path="/process" component={Process} />
                </Switch>
              </div>
            </Router>
          </div>
        </Web3Provider>
      </AlertProvider>
    )
  }
}

export default App
