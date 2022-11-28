import React from "react";

// === Component === //
import { InputNumber, Row, Col, Button, Space, Tag } from "antd";
import { useState } from "react";

// === Hooks === //
import useLotteryContract from "./../hooks/useLotteryContract";

const Games = props => {
  const { userProvider } = props;
  const [value, setValue] = useState(0);
  const { tvl, players, pickWinner, participate } = useLotteryContract(userProvider);

  const deposit = () => {
    participate(value);
  };

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        {players.map((item, index) => (
          <Tag key={index}>{item}</Tag>
        ))}
        <Button type="primary" onClick={pickWinner}>
          Pick Winner
        </Button>
      </Col>
      <Col span={24}>
        <span>Tvl：{tvl.toString()} ETH</span>
      </Col>
      <Col span={24}>
        <Space>
          <InputNumber step={1} value={value} onChange={setValue} />
          <Button type="primary" onClick={deposit}>
            Deposit
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default Games;
