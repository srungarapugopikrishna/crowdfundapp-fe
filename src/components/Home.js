import * as React from "react";
import CrowdFundApp from "../CrowdFundingApp.json";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

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

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fund = formData.get("funding");
    alert(`Fund=${fund}`);
  };

  async function getAllPosts() {
    console.log("-====-In getAllPosts-====-");
    const ethers = require("ethers");
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
        console.log(i);
        let item = {
          postId: i.postId.toNumber(),
          postTitle: i.postTitle,
          postDescription: i.postDescription,
          postOwner: i.postOwner,
          timestamp: i.timestamp,
        };
        return item;
      })
    );
    updateFetched(true);
    updateData(items);
  }

  if (!dataFetched) getAllPosts();

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 3, md: 4 }}>
        {data.map((value, index) => {
          // return data[index].postTitle + "<>" + data[index].postDescription;
          return (
            <Grid item xs={6}>
              <Item>Title: {data[index].postTitle} </Item>
              <Item>Description: {data[index].postDescription}</Item>
              <Item>Amount Collected: 0</Item>
              <Item>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="ETH"
                    id={data[index].postId}
                    name="funding"
                    defaultValue="0.01"
                    size="small"
                  />
                  <Button variant="contained" type="submit">
                    Fund
                  </Button>
                </form>
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
