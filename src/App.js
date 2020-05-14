import React, {Component } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Nav from './components/Nav';
import Dashboard from './components/Dashboard';
import Process from './components/Process';
import Home from './components/Home';
import {Web3Provider} from './components/Web3Context';


class App extends Component {
    render() {
        
        return (
            <Web3Provider>
                <div>
                    <Router>
                        <div className="App">
                            <Nav/>
                            <Switch>
                                <Route path='/' exact
                                    component={Home}/>
                                <Route path='/dashboard'
                                    component={Dashboard}/>
                                <Route path='/process'
                                    component={Process}/>
                            </Switch>
                        </div>
                    </Router>
                </div>
            </Web3Provider>
        );
    }
}

export default App;
