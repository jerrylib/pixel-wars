import React from "react";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home() {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  return (
    <div>
      <h1>游戏玩法介绍</h1>
      <ul>
        <ol>安装metamask</ol>
        <ol>获得ETH币</ol>
        <ol>xxxxx</ol>
      </ul>
    </div>
  );
}

export default Home;
