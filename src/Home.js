import React from 'react';

function Home() {

    const isMetaMaskInstalled = () => { // Have to check the ethereum binding on the window object to see if it's installed
        const {ethereum} = window;
        return(Boolean(ethereum && ethereum.isMetaMask) ? console.log("Yes") : console.log("No"));
    };

    return (
        <div className="Home">
            <h1>Home</h1>
            <button onClick={isMetaMaskInstalled}>Check Metamask</button>
        </div>
    );
}

export default Home;
