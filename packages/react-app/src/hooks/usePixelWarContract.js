import { useCallback, useEffect, useState } from "react";

// === Utils === //
import * as ethers from "ethers";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";

// === Constants === //
import { PIXEL_WAR_ADDRESS, PIXEL_WAR_ABI, DEFAULT_COLOR } from "./../constants";

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

    Promise.all([contracts.maxX(), contracts.maxY()])
      .then(([maxX, maxY]) => {
        const nextMaxX = 10;
        const nextMaxY = 10;
        setX(nextMaxX);
        setY(nextMaxY);
        const promiseArray = [];
        for (let index = 0; index < nextMaxX; index++) {
          for (let innerIndex = 0; innerIndex < nextMaxY; innerIndex++) {
            promiseArray.push(contracts.getColor(index, innerIndex).catch(() => DEFAULT_COLOR));
          }
        }

        setData(promiseArray);
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
    (address, currentX, currentY, color, transation) => {
      const currentXValue = currentX.toNumber();
      const currentYValue = currentY.toNumber();
      const nextData = map(data, (item, index) => {
        if (currentXValue * y + currentYValue === index) return Promise.resolve(color);

        return item;
      });
      setData(nextData);
      transation.getBlock().then(({ timestamp }) => {
        const time = moment(1000 * timestamp);
        setEvents([
          {
            time: time.format("yyyy-MM-DD HH:mm:ss"),
            address,
            x: currentXValue,
            y: currentYValue,
            color,
          },
          ...events,
        ]);
      });
    },
    [events, data, y],
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
