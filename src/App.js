import React, {Component } from 'react';
import './App.css';
import Nav from './Nav';
import Dashboard from './Dashboard';
import Process from './Process';
import Home from './Home';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Web3Provider} from './Web3Context';

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
