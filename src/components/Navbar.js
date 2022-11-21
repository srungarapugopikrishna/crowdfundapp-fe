import { Link } from "react-router-dom";
import { useMatch } from "react-router-dom";
import { useResolvedPath } from "react-router-dom";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useLocation } from "react-router";
export default function Navbar() {
  const [walletAddress, setWalletAddress] = useState("0x");
  const [connected, toggleConnect] = useState(false);
  const location = useLocation();
  const [currAddress, updateAddress] = useState("0x");

  function updateButton() {
    const walletButton = document.querySelector(".connectWalletButton");
    if ({ connected }) {
      walletButton.textContent = "Connected";
      walletButton.style.backgroundColor = "green";
    } else {
      disconnectWallet();
    }
  }

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  async function requestAccount() {
    console.log("<<<<<=============In requestAccount===========>>>>>");
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

  async function disconnectWallet() {
    const walletButton = document.querySelector(".connectWalletButton");
    walletButton.textContent = "Connect Wallet";
    walletButton.style.backgroundColor = "tomato";
    // toggleConnect(false);
    // connected = false;
  }

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      console.log(connected);
      if (connected) {
        console.log("Already connected... Disconnecting");
        disconnectWallet();
      } else {
        console.log("Not connected... Initiating connection");
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
      }
    } else {
      console.log("typeof window.ethereum is undefined");
    }
  }

  // useEffect(() => {
  //   let val = window.ethereum.isConnected();
  //   console.log("val::::", val);
  //   if (val) {
  //     console.log("is this because of this?", val);
  //     getAddress();
  //     toggleConnect(val);
  //     updateButton();
  //   }
  //   window.ethereum.on("accountsChanged", function (accounts) {
  //     console.log("---------------->>>>");
  //     window.location.replace(location.pathname);
  //   });
  // });

  return (
    <nav className="nav">
      <Link to="/" className="crowd-fund-app">
        CrowdFundApp
      </Link>
      <ul>
        <CustomLink to="/myfunds">My Funds</CustomLink>
        <CustomLink to="/categories">Categories</CustomLink>
        <CustomLink to="/profile">Profile</CustomLink>
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
