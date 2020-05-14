import React, {useContext, useState, useEffect} from 'react';
import {Web3Context} from './Web3Context';
import CapitalETH from '../abis/CapitalETH.json';
import SIPPlan from './SIPPlan';

function Dashboard() {

    const [web3, setWeb3, account, setAccount] = useContext(Web3Context);
    const CAPITAL_ETH_ROPSTEN = '0xCbEb765A8aD0dF1CF3Ba473EDb21991aa0464EFF';

    const [plans, setPlans] = useState({});

    useEffect(() => {
      fetchPlans();
    }, []);

    const fetchPlans = async () => {
        if (account === '') {
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);
            console.log("Account", account);
            console.log(account);
        }

        const capitalETHInstance = new web3.eth.Contract(CapitalETH.abi, CAPITAL_ETH_ROPSTEN);

        const data = await capitalETHInstance.methods.plans(0).call();
        console.log(data);
        setPlans(data);
    }
    return (
        <div>
            <h1>Dashboard</h1>
            <SIPPlan data={plans}/>
           
        </div>
    );
}

export default Dashboard;
