import * as React from "react";
import CrowdFundApp from "../CrowdFundingApp.json";
import { useState } from "react";

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
    <div>
      {data.map((value, index) => {
        return data[index].postTitle + "<>" + data[index].postDescription;
      })}
    </div>
  );
}
