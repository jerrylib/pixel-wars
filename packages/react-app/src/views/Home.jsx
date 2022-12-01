import React from "react";
import { Row, Col } from "antd";

import pic1 from "./images/pic1.png";
import pic2 from "./images/pic2.png";
import pic3 from "./images/pic3.png";
import pic4 from "./images/pic4.png";
import pic5 from "./images/pic5.png";
import pic6 from "./images/pic6.png";
import pic7 from "./images/pic7.png";

// === Styles === //
import "./style.css";

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
        <h1>游戏玩法介绍1</h1>
        <p>区块链小游戏</p>
        <h2>1. 安装metamask</h2>
        <p>访问 https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en-US</p>
        <img className="imageItem" src={pic1} alt="" />
        <h2>2. 申请或导入metamask的助记词(助记词由12个单词组成)</h2>
        <img className="imageItem" src={pic2} alt="" />
        <h2>3. 配置Goerli测试网络</h2>
        <img className="imageItem" src={pic3} alt="" />
        <code>
          <p>rpc url: https://goerli.infura.io/v3/</p>
          <p>chain id: 5</p>
          <p>货币符号：GoerliETH</p>
          <p>区块链浏览器（选填）：https://goerli.etherscan.io</p>
        </code>
        <h2>4. 获得ETH币</h2>
        <p>水龙头获取(https://goerlifaucet.com)或联系李彬(180505)</p>
        <h2>5. Pixel War</h2>
        <p>
          像素战争，通过修改区块的颜色，绘制自己想要的图案，数据记录在链上。
          <p style={{ color: "red" }}>目前 1000 * 1000 还存在性能问题</p>
        </p>
        <img className="imageItem" src={pic4} alt="" />
        <img className="imageItem" src={pic5} alt="" />
        <h2>6. Game</h2>
        <p>
          0.01个ETH起投，奖池大于0.05个ETH即可开奖。开奖人员获得1%的奖励，合约发布者收取1%的佣金，余下资金由中奖人员获得。
        </p>
        <img className="imageItem" src={pic6} alt="" />
        <img className="imageItem" src={pic7} alt="" />
        <h2>7. About us</h2>
        <p>
          <b>项目已开源，欢迎共创。https://github.com/jerrylib/pixel-wars</b>
        </p>
      </Col>
    </Row>
  );
}

export default Home;
