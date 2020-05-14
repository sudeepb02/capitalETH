import React, { useState, useEffect, useContext } from 'react';
import {Link} from 'react-router-dom';
import Web3 from "web3";
import './Nav.css';
import {Web3Context} from './Web3Context';

function Nav() {

    const [web3, setWeb3] = useContext(Web3Context);
    const [account, setAccount] = useState('');

    const connect = async () => {
        if (window.ethereum) {
            await window.ethereum.enable();
            console.log("Ethereum enabled");
            const web3new = new Web3(window.ethereum);
            setWeb3(web3new);
            const accounts = await web3new.eth.getAccounts();
            setAccount(accounts[0]);
            console.log(account);
        }
    } 

    return (
        <nav>
            <div className="logo">
                <Link to="/">capitalETH</Link>
            </div>
            <ul className="nav-links">
                <Link to='/dashboard'>
                    <li>Dashboard</li>
                </Link>
                <Link to='/process'>
                    <li>Process</li>
                </Link>
                <button onClick={connect}> 
                    { account === '' ? "Connect" : "Connected"}
                </button>
            </ul>          
        </nav>
    );
}

export default Nav;
