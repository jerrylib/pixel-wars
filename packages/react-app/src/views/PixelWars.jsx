import React, { useState } from "react";

// === Components === //
import { SketchPicker } from "react-color";
import { Popover, Row, Col, List, Typography, Spin } from "antd";

// === Hooks === //
import usePixelWarContract from "./../hooks/usePixelWarContract";

// === Utils === //
import map from "lodash/map";
import isUndefined from "lodash/isUndefined";

// === Contants === //
import { DEFAULT_COLOR } from "./../constants";

// === Styles === //
import "./style.css";

const Block = props => {
  const { x, y, style, colors, handleMouseEnter } = props;
  const dataId = `${x}-${y}`;
  const color = colors[dataId];
  return (
    <div
      id={dataId}
      key={dataId}
      style={{
        ...style,
        background: color,
      }}
      onMouseEnter={() => handleMouseEnter(x, y)}
      className={isUndefined(color) ? "PixelWarsItemNotFetch" : "PixelWarsItem"}
    />
  );
};

const PixelWars = props => {
  const { address, userProvider } = props;
  const { x, y, loading, update, events, colors, loadColor } = usePixelWarContract(userProvider);
  const [color, setColor] = useState(localStorage.getItem("color") || DEFAULT_COLOR);

  const colorUpdate = event => {
    const id = event.target.getAttribute("id");
    const [x, y] = id.split("-");
    update(x, y, color);
  };

  const heightEvery = `${100 / x}%`;
  const widthEvery = `${100 / y}%`;

  return (
    <Row gutter={[24, 24]} style={{ padding: "1rem" }}>
      <Col span={18}>
        <Spin spinning={loading}>
          {!loading && (
            <div className={"PixelWarsContainer"} onClick={colorUpdate}>
              {map(new Array(x), (item, index) => {
                return map(new Array(y), (innerItem, innerIndex) => {
                  return (
                    <Block
                      x={index}
                      y={innerIndex}
                      colors={colors}
                      handleMouseEnter={loadColor}
                      style={{ height: heightEvery, width: widthEvery }}
                    />
                  );
                });
              })}
            </div>
          )}
        </Spin>
      </Col>
      <Col span={6}>
        <p>
          选择&nbsp;&nbsp;
          <Popover
            content={
              <SketchPicker
                styles={{ wrap: { margin: "0 auto" } }}
                color={color}
                onChangeComplete={v => {
                  setColor(v.hex);
                  localStorage.setItem("color", v.hex);
                }}
              />
            }
            title="Color Picker"
          >
            <span
              style={{
                background: color,
                border: `1px solid ${color === DEFAULT_COLOR ? "#ddd" : color}`,
                padding: "0 1rem",
                cursor: "pointer",
              }}
            ></span>
          </Popover>
          &nbsp;&nbsp; 颜色填充在上面的区域中
        </p>
        <List
          header={<div>修改记录</div>}
          bordered
          dataSource={events}
          renderItem={(item, index) => (
            <List.Item title={item.address} key={index}>
              <Typography.Text mark={address === item.address}>[{item.time}]</Typography.Text> x:{1 + item.x} y:
              {1 + item.y} <span style={{ background: item.color, padding: "0 0.6rem", marginLeft: "0.5rem" }}></span>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};

export default PixelWars;
