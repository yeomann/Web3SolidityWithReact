import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import WavePortalAbi from "./utils/WavePortal.json";
import "./App.css";

const App = () => {
  /*
   * Just a state variable we use to store our user's public wallet.
   */
  const [currentAccount, setCurrentAccount] = useState("");
  const [isMining, setIsMining] = useState(false);
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  // rinkeby: 0x1307e61ECFCEA1872ab1B9BccB6D76e84119484F
  // goerli: 0x1115e3A37e1b292b8E089ac5A50a8879e280FE1D - v1
  // gerli: 0x14749e3c5c1AbF890A79f060186942505257d84B - v2
  const contractAddress = "0x14749e3c5c1AbF890A79f060186942505257d84B";
  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = WavePortalAbi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      // Will open the MetaMask UI
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const wave = async () => {
    console.log("wave called");
    console.log("contractABI=", contractABI);
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Ethereum object doesn't exist!");
      }

      // A "Provider" is what we use to actually talk to Ethereum nodes.
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      /*
       * You're using contractABI here
       */
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      console.log(signer, wavePortalContract);

      let count = await wavePortalContract.getTotalWavesCount();
      console.log("Retrieved total wave count...", count.toNumber());
      /*
       * Execute the actual wave from your smart contract
       */
      const waveTxn = await wavePortalContract.AddWave();
      console.log("Mining...", waveTxn.hash);
      setIsMining(true);

      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);
      setIsMining(false);
      
      count = await wavePortalContract.getTotalWavesCount();
      console.log("Retrieved total wave count...", count.toNumber());
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    window.ethereum.on("chainChanged", (chainId) => {
      console.log(parseInt(chainId, 16));
    });
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="wave">
            👋
          </span>{" "}
          Hey there!
        </div>

        <div className="bio">
          Hey, Connect your Ethereum wallet and wave at me!
        </div>

        <button 
          className={`waveButton ld-ext-right ${isMining ? 'running' : ''}`}
          onClick={wave} 
          disabled={isMining}
        >
          {isMining ? "Mining wave at Eth Network..." : "Wave at Me"}
          <div className="ld ld-ring ld-spin-fast"></div>
        </button>

        {/*
         * If there is no currentAccount render this button or show connected account
         */}
        {currentAccount ? (
          <p className="connected-acc">
            Connected account:
            <code>{currentAccount}</code>
          </p>
        ) : (
          <button className="walletButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
