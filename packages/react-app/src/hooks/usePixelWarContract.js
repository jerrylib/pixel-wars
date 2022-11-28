import React, { Component, useCallback, useEffect, useState } from "react";

// === Utils === //
import * as ethers from "ethers";
import first from "lodash/first";
import isEmpty from "lodash/isEmpty";

// === Constants === //
import { PIXEL_WAR_ADDRESS, PIXEL_WAR_ABI } from "./../constants";

const { Contract } = ethers;

const usePixelWarContract = userProvider => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const contract = useCallback(() => {
    const pixelWarContract = new Contract(PIXEL_WAR_ADDRESS, PIXEL_WAR_ABI, userProvider);
    return pixelWarContract;
  }, [userProvider]);

  const loadMap = useCallback(async () => {
    const contracts = contract();
    if (isEmpty(contracts) || isEmpty(userProvider)) return;
    contracts
      .getMap()
      .then(v => {
        setX(first(v).length);
        setY(v.length);
        setData(v);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      });
  }, [contract, userProvider]);

  const update = useCallback(
    async (x, y, color) => {
      const contracts = contract();
      if (isEmpty(contracts)) return;
      const signer = userProvider.getSigner();
      contracts.connect(signer).update(x, y, color);
    },
    [contract, userProvider],
  );

  const addEventListener = useCallback(
    (address, x, y, color) => {
      console.log("ColorUpdate=", address, x, y, color);
      const nextData = data.map((item, outerIndex) => {
        return item.map((i, innerIndex) => {
          if (x.eq(outerIndex) && y.eq(innerIndex)) return color;
          return data[outerIndex][innerIndex];
        });
      });
      setData(nextData);
      setEvents({
        address,
        x,
        y,
        color,
      });
    },
    [data],
  );

  useEffect(loadMap, [loadMap]);

  useEffect(() => {
    const contracts = contract();
    if (isEmpty(contracts) || isEmpty(userProvider)) return;
    contracts.on("ColorUpdate", addEventListener);
    return () => {
      contracts.off("ColorUpdate", addEventListener);
    };
  }, [addEventListener, contract, userProvider]);

  return {
    x,
    y,
    data,
    loading,
    update,
    events,
  };
};

export default usePixelWarContract;
