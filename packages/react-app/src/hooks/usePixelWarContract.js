import { useCallback, useEffect, useState } from "react";

// === Utils === //
import * as ethers from "ethers";
import moment from "moment";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";
import reduce from "lodash/reduce";
import debounce from "lodash/debounce";

// === Constants === //
import { PIXEL_WAR_ADDRESS, PIXEL_WAR_ABI } from "./../constants";

const { Contract } = ethers;

const usePixelWarContract = userProvider => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [colors, setColors] = useState({});
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);

  const contract = useCallback(() => {
    const pixelWarContract = new Contract(PIXEL_WAR_ADDRESS, PIXEL_WAR_ABI, userProvider);
    return pixelWarContract;
  }, [userProvider]);

  const loadMap = useCallback(async () => {
    const contracts = contract();
    if (isEmpty(contracts) || isEmpty(userProvider)) return;

    setLoading(true);
    Promise.all([contracts.maxX(), contracts.maxY()])
      .then(([maxX, maxY]) => {
        const nextMaxX = maxX.toNumber();
        const nextMaxY = maxY.toNumber();
        setX(nextMaxX);
        setY(nextMaxY);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      });
  }, [contract, userProvider]);

  // eslint-disable-next-line
  const loadColor = useCallback(
    debounce((currentX, currentY) => {
      const contracts = contract();
      if (isEmpty(contracts) || isEmpty(userProvider)) return;
      const promiseArray = [];
      [currentX - 1, currentX, currentX + 1].forEach(element => {
        [currentY - 1, currentY, currentY + 1].forEach(innerElement => {
          const key = `${element}-${innerElement}`;
          if (element < 0 || innerElement < 0 || element >= x || innerElement >= y || !isUndefined(colors[key])) return;
          promiseArray.push(
            contracts.getColor(element, innerElement).then(color => {
              return {
                [key]: color,
              };
            }),
          );
        });
      });
      Promise.allSettled(promiseArray).then(res => {
        const nextColors = reduce(
          map(res, "value"),
          (rs, item) => {
            return {
              ...rs,
              ...item,
            };
          },
          colors,
        );
        setColors(nextColors);
      });
    }, 500),
    [contract, userProvider, colors, x, y],
  );

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
      const nextColors = { ...colors, [`${currentX}-${currentY}`]: color };
      setColors(nextColors);
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
    [events, colors],
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

  useEffect(() => {
    const interval = setInterval(() => {
      const contracts = contract();
      if (isEmpty(contracts) || isEmpty(userProvider)) return;
      const promiseArray = [];
      console.groupCollapsed("开始定时获取颜色");
      for (let index = 0; index < x; index++) {
        for (let innerIndex = 0; innerIndex < y; innerIndex++) {
          const key = `${index}-${innerIndex}`;
          if (isUndefined(colors[key])) {
            console.log("check:", index, innerIndex);
            promiseArray.push(
              contracts
                .getColor(index, innerIndex)
                .then(color => {
                  return {
                    [`${index}-${innerIndex}`]: color,
                  };
                })
                .catch(() => {}),
            );
          }
        }
        if (promiseArray.length > 120) break;
      }
      console.groupEnd("开始定时获取颜色");
      if (promiseArray.length === 0) return;
      Promise.allSettled(promiseArray).then(res => {
        console.log("获取成功,", res, map(res, "value"));
        const nextColors = reduce(
          map(res, "value"),
          (rs, item) => {
            return {
              ...rs,
              ...item,
            };
          },
          colors,
        );
        setColors(nextColors);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [contract, userProvider, colors, x, y]);

  return {
    x,
    y,
    colors,
    loadColor,
    loading,
    update,
    events,
  };
};

export default usePixelWarContract;
