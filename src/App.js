import React from 'react';
import './App.css';
import Nav from './Nav';
import Dashboard from './Dashboard';
import About from './About';
import Home from './Home';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="App">
                <Nav/>
                <Switch>
                    <Route path='/' exact
                        component={Home}/>
                    <Route path='/dashboard'
                        component={Dashboard}/>
                    <Route path='/about'
                        component={About}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
