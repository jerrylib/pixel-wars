import React from "react";

// === Component === //
import { InputNumber, Row, Col, Button, Space, List, Typography } from "antd";
import { useState } from "react";

// === Hooks === //
import useLotteryContract from "./../hooks/useLotteryContract";

// === Utils === //
import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import first from "lodash/first";
import values from "lodash/values";
import * as ethers from "ethers";

const Games = props => {
  const { address, userProvider } = props;
  const [value, setValue] = useState(1);
  const { tvl, players, pickWinner, participate } = useLotteryContract(userProvider);

  const deposit = () => {
    if (value > 0) {
      participate(value);
    }
  };

  const sortData = sortBy(values(groupBy(players)), item => -1 * item.length);

  return (
    <Row style={{ padding: "1rem" }} align="middle" justify="center">
      <Col span={12}>
        <List
          header={<div>下注详情（Tvl：{ethers.utils.formatUnits(tvl, 18)} ETH）</div>}
          footer={
            <Button type="primary" onClick={pickWinner}>
              Pick Winner
            </Button>
          }
          bordered
          dataSource={sortData}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <Typography.Text mark={address === first(item)}>
                [{((100 * item.length) / players.length).toFixed(2)}%]
              </Typography.Text>{" "}
              {first(item)}
            </List.Item>
          )}
        />
      </Col>
      <Col span={12} style={{ textAlign: "center" }}>
        <Space>
          <InputNumber step={1} value={value} onChange={setValue} addonAfter="倍数" />
          <Button type="primary" onClick={deposit}>
            下注
          </Button>
        </Space>
        <p>0.01 ETH 起下注，25 倍即投入 0.25 个 ETH</p>
      </Col>
    </Row>
  );
};

export default Games;
