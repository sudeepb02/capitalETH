import React, {useState, useEffect} from 'react';
import './App.css';
import Nav from './Nav';
import Dashboard from './Dashboard';
import About from './About';
import Home from './Home';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() {

    const [account, setAccount] = useState('');

    const isMetaMaskInstalled = () => {
        const {ethereum} = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    };

    const onClickConnect = async () => {
        const {ethereum} = window;
        try { // Will Start the MetaMask Extension
            await ethereum.enable();
            console.log("Ethereum connected");
        } catch (error) {
            console.error(error);
        }
    };

    const getAccounts = async () => {
        const {ethereum} = window;
        if (isMetaMaskInstalled()) {
            console.log("Yes");

            await onClickConnect();

            ethereum.sendAsync({
                method: 'eth_accounts'
            }, (error, response) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(response.result[0] || 'Not able to get accounts');
                    setAccount(response.result[0]);
                }
            });
        } else {
            console.log("NO");
        }
    }

    useEffect(() => {
      getAccounts();
    }, [account])

    return (
        <div>
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
            <button onClick={getAccounts}>Connect</button>
            <p>Account: {account}</p>
        </div>
    );
}

export default App;
