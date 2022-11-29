const { ethers } = require("hardhat");
const { expect } = require("chai");

const { BigNumber } = ethers;

describe("My Dapp", function () {
  let myContract;

  describe("Lottery", function () {
    it("Should deploy Lottery", async function () {
      const LotteryContract = await ethers.getContractFactory("Lottery");

      myContract = await LotteryContract.deploy();
    });

    describe("participate()", function () {
      it("Should be participate ", async function () {
        const turn = 2;
        await myContract.participate(turn, {
          value: BigNumber.from(10).pow(18).mul(turn),
        });
        const players = await myContract.getPlayers();
        expect(players.length).to.equal(turn);
      });
    });
    describe("pickWinner()", function () {
      it("pickWinner() success", async function () {
        await myContract.pickWinner();
        const players = await myContract.getPlayers();
        expect(players.length).to.equal(0);
      });
    });
  });
});
