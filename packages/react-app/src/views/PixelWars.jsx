import React, { Component } from "react";

// === Hooks === //
import usePixelWarContract from "./../hooks/usePixelWarContract";

// === Utils === //
import map from "lodash/map";
import get from "lodash/get";

// === Styles === //
import "./style.css";
import { useState } from "react";

const DEFAULT_COLOR = "#DDD";

const PixelWars = props => {
  const { userProvider } = props;
  const { x, y, data, loading, update, events } = usePixelWarContract(userProvider);
  const [color, setColor] = useState(DEFAULT_COLOR);
  console.log("x, y, data=", x, y, data);

  const colorUpdate = (x, y) => {
    update(x, y, color);
  };

  const heightEvery = `${100 / x}%`;
  const widthEvery = `${100 / y}%`;
  return (
    <div className={"PixelWarsContainer"}>
      {map(new Array(x), (item, index) => {
        return map(new Array(y), (innerItem, innerIndex) => {
          const color = get(data, `${index}.${innerIndex}`, DEFAULT_COLOR);
          return (
            <div
              key={`${index}-${innerIndex}-${color}`}
              className={"PixelWarsItem"}
              style={{ height: heightEvery, width: widthEvery, background: color }}
              onClick={() => colorUpdate(index, innerIndex)}
            />
          );
        });
      })}
    </div>
  );
};

export default PixelWars;
