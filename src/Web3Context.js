import React, { useState, useContext, createContext } from 'react';

export const Web3Context = createContext();

export const Web3Provider = (props) => {

	// const [account, setAccount] = useState('');
	const [web3, setWeb3] = useState({});
	const [account, setAccount] = useState('');
	
	return (
		<Web3Context.Provider value={[web3, setWeb3, account, setAccount]}>
			{props.children}
		</Web3Context.Provider>

	)

}