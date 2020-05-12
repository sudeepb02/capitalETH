import React, {useContext} from 'react';
import { Web3Context } from './Web3Context';


function Home() {

    const [web3, setWeb3, account, setAccount] = useContext(Web3Context);

    return (
        <div className="Home">
            <h1>Home</h1>
 
            <p>{account}</p>
        </div>
    );
}

export default Home;
