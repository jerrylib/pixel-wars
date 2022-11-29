import React from "react";
import { Row, Col } from "antd";

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
    <Row style={{ padding: "1rem" }}>
      <Col span={24}>
        <h1>游戏玩法介绍</h1>
        <h2>安装metamask</h2>
        <h2>获得ETH币</h2>
        <h2>Pixel War</h2>
        <h2>Game</h2>
      </Col>
    </Row>
  );
}

export default Home;
