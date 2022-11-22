// export default function MyFunds() {
//   return <h1>My Funds</h1>;
// }

import { useState } from "react";
import CrowdFundApp from "../CrowdFundingApp.json";

const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: (event) => {
        setValue(event.target.value);
      },
    },
  };
};

async function createApost(title, desc) {
  const ethers = require("ethers");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  let contract = new ethers.Contract(
    CrowdFundApp.address,
    CrowdFundApp.abi,
    signer
  );
  const createPostTx = await contract.createPost(title, desc, {
    value: ethers.utils.parseEther("0.001"),
  });
  const createTxOutput = await createPostTx.wait();
  console.log("=====>>>>Create Post<<<<====");
  console.log("createTxOutput::::", createTxOutput);
}

export default function CreateCampaign(props) {
  const {
    value: postTitle,
    bind: bindPostTitle,
    reset: resetPostTitle,
  } = useInput("");
  const {
    value: postDescription,
    bind: bindPostDescription,
    reset: resetPostDescription,
  } = useInput("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    createApost(postTitle, postDescription);
    resetPostTitle();
    resetPostDescription();
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Post Title:
        <input type="text" {...bindPostTitle} />
      </label>
      <label>
        Post Desc:
        <input type="text" {...bindPostDescription} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
