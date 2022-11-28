import { useCallback, useEffect, useState } from "react";

// === Utils === //
import * as ethers from "ethers";
import isEmpty from "lodash/isEmpty";

// === Constants === //
import { LOTTERY_ADDRESS, LOTTERY_ABI } from "../constants";

const { Contract } = ethers;

const useLotteryContract = userProvider => {
  const [players, setPlayers] = useState([]);
  const [tvl, setTvl] = useState(ethers.BigNumber.from("0"));
  const [loading, setLoading] = useState(false);

  const contract = useCallback(() => {
    const pixelWarContract = new Contract(LOTTERY_ADDRESS, LOTTERY_ABI, userProvider);
    return pixelWarContract;
  }, [userProvider]);

  const load = useCallback(async () => {
    const contracts = contract();
    if (isEmpty(contracts) || isEmpty(userProvider)) return;
    contracts
      .getPlayers()
      .then(setPlayers)
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 300);
      });
    userProvider.getBalance(LOTTERY_ADDRESS).then(setTvl);
  }, [contract, userProvider]);

  const participate = useCallback(
    async turn => {
      const contracts = contract();
      if (isEmpty(contracts)) return;
      const signer = userProvider.getSigner();
      contracts.connect(signer).participate(turn, { value: turn });
    },
    [contract, userProvider],
  );

  const pickWinner = useCallback(async () => {
    const contracts = contract();
    if (isEmpty(contracts)) return;
    const signer = userProvider.getSigner();
    contracts.connect(signer).pickWinner();
  }, [contract, userProvider]);

  useEffect(load, [load]);

  useEffect(() => {
    const contracts = contract();
    if (isEmpty(contracts) || isEmpty(userProvider)) return;
    contracts.on("Participate", load);
    contracts.on("PickWinner", load);
    return () => {
      contracts.off("Participate", load);
      contracts.on("PickWinner", load);
    };
  }, [contract, userProvider, load]);

  return {
    tvl,
    players,
    loading,
    pickWinner,
    participate,
  };
};

export default useLotteryContract;
