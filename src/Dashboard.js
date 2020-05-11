import React, {useContext, useState } from 'react';
import { Web3Context } from './Web3Context';

function Dashboard() {

    const [web3, setWeb3, account, setAccount] = useContext(Web3Context);

    const display = async () => {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        console.log("Account", account);
        console.log(account);

    }
    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={display}>Test</button>
        </div>
    );
}

export default Dashboard;
