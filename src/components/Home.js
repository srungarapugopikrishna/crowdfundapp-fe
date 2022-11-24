import * as React from "react";
import CrowdFundApp from "../CrowdFundingApp.json";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ethers } from "ethers";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

async function fundAPost(postId, fundingAmount) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  let contract = new ethers.Contract(
    CrowdFundApp.address,
    CrowdFundApp.abi,
    signer
  );
  const fundPostTx = await contract.fundPost(postId, {
    value: ethers.utils.parseEther(fundingAmount),
    gasLimit: 100000,
  });
  const fundAPostTxOutput = await fundPostTx.wait();
  console.log("FundTxOutput::::", fundAPostTxOutput);
}

export default function Home() {
  const sampleData = [
    {
      postId: 11,
      postTitle: "this is 11th post",
      postOwner: "iamowner",
      postDescription: "Description of POst",
      timestamp: "-----",
    },
    {
      postId: 10,
      postTitle: "this is 10th post",
      postOwner: "iamowner10",
      postDescription: "10 Description of POst",
      timestamp: "-----",
    },
    {
      postId: 12,
      postTitle: "this is 12th post",
      postOwner: "iamowner12",
      postDescription: "12 Description of POst",
      timestamp: "-----",
    },
  ];
  const [data, updateData] = useState(sampleData);
  const [dataFetched, updateFetched] = useState(false);
  const [currAddress, updateAddress] = useState("0x");

  const state = {
    button: 0,
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (state.button === 1) {
      const formData = new FormData(event.currentTarget);
      const fund = formData.get("funding");
      const postId = event.currentTarget.id;
      fundAPost(postId, fund);
    }
    if (state.button === 2) {
      alert("WITHDRAW NOW");
    }
  };

  async function getAddress() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    updateAddress(addr);
  }

  async function getAllPosts() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(
      CrowdFundApp.address,
      CrowdFundApp.abi,
      signer
    );
    let transaction = await contract.getAllPosts();

    const items = await Promise.all(
      transaction.map(async (i) => {
        let item = {
          postId: i.postId.toNumber(),
          postTitle: i.postTitle,
          postDescription: i.postDescription,
          postOwner: i.postOwner,
          contractOwner: i.contractOwner,
          postFunding: ethers.utils.formatEther(i.funding),
          timestamp: i.timestamp,
        };
        console.log();
        return item;
      })
    );
    updateFetched(true);
    updateData(items);
    getAddress();
  }

  if (!dataFetched) getAllPosts();

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 3, md: 4 }}>
        {data.map((value, index) => {
          return (
            <Grid item xs={6}>
              <form id={data[index].postId} onSubmit={handleSubmit}>
                <Item>Title: {data[index].postTitle} </Item>
                <Item>Description: {data[index].postDescription}</Item>
                <Item>Funding Received: {data[index].postFunding}</Item>
                <Item>
                  <TextField
                    label="ETH"
                    id={data[index].postId}
                    name="funding"
                    defaultValue="0.01"
                    size="small"
                  />
                  <Button
                    onClick={() => (state.button = 1)}
                    variant="contained"
                    type="submit"
                    name="fundbutton"
                  >
                    Fund
                  </Button>
                </Item>
                <Item>PostOwner: {data[index].postOwner}</Item>
                {/* {data[index].postOwner === currAddress ? (
                  <Item>
                    <Button
                      onClick={() => (state.button = 2)}
                      variant="contained"
                      type="submit"
                      name="withdraw"
                    >
                      withdraw
                    </Button>
                  </Item>
                ) : (
                  ""
                )} */}
              </form>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
