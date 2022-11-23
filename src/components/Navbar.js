import { Link } from "react-router-dom";
import { useMatch } from "react-router-dom";
import { useResolvedPath } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCallback } from "react";
import { useLocation } from "react-router";

export default function Navbar() {
  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState("0x");

  // function updateButton() {
  //   const walletButton = document.querySelector(".connectWalletButton");
  //   if ({ connected }) {
  //     walletButton.textContent = "Connected";
  //     walletButton.style.backgroundColor = "green";
  //   }
  // }
  const updateButton = useCallback(() => {
    const walletButton = document.querySelector(".connectWalletButton");
    if ({ connected }) {
      walletButton.textContent = "Connected";
      walletButton.style.backgroundColor = "green";
    }
  }, []);
  let provider;

  async function getAddress() {
    const ethers = require("ethers");
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  async function requestAccount() {
    if (connected) {
      console.log("Metamask Connected::::", connected);
    } else {
      console.log("Metamask is not Connected::::", connected);
      if (window.ethereum) {
        try {
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
          if (chainId !== "0x5") {
            // alert('Incorrect network! Switch your metamask to Goerli');
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x5" }],
            });
          }
          await window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then(() => {
              updateButton();
              getAddress();
            });
        } catch (error) {
          console.log("Error connecting");
        }
      } else {
        console.log("metamask not detected");
      }
      console.log("walletAddress::", currAddress);
    }
  }

  async function connectWallet() {
    console.log("connecting wallet: now is it is connected:::", connected);
    if (typeof window.ethereum !== "undefined") {
      console.log(connected);
      if (connected) {
        console.log("Already connected... Disconnecting");
      } else {
        console.log("Not connected... Initiating connection");
        await requestAccount();
      }
    } else {
      console.log("typeof window.ethereum is undefined");
    }
  }

  //This helps when page loads the button to make it as connected
  window.onload = () => {
    isConnected();
  };
  async function isConnected() {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      console.log(`You're connected to: ${accounts[0]}`);
      updateButton();
      updateAddress(window.ethereum._state.accounts[0]);
      toggleConnect(true);
    } else {
      console.log("Metamask is not connected");
    }
  }

  //This helps when page is refreshed to update the button
  useEffect(() => {
    console.log(
      "window.ethereum._state.accounts::::",
      window.ethereum._state.accounts
    );

    if (window.ethereum._state.accounts && window.ethereum._state.accounts[0]) {
      console.log("it is conected");
      updateButton();
      updateAddress(window.ethereum._state.accounts[0]);
      toggleConnect(true);
    }
    window.ethereum.on("accountsChanged", function (accounts) {
      window.location.replace(location.pathname);
    });
  }, [updateButton, location.pathname]);

  return (
    <nav className="nav">
      <Link to="/" className="crowd-fund-app">
        CrowdFundApp
      </Link>
      <ul>
        <CustomLink to="/createcampaign">CreateCampaign</CustomLink>
        {/* <CustomLink to="/categories">Categories</CustomLink>
        <CustomLink to="/profile">Profile</CustomLink> */}
        <li>
          <div>
            <button className="connectWalletButton" onClick={connectWallet}>
              {connected ? "Connected" : "Connect Wallet"}
            </button>
            Connected to {currAddress}
          </div>
        </li>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
