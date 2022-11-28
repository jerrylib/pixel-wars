const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("My Dapp", function () {
  let myContract;

  describe("Lottery", function () {
    it("Should deploy Lottery", async function () {
      const LotteryContract = await ethers.getContractFactory("Lottery");

      myContract = await LotteryContract.deploy();
    });

    describe("participate()", function () {
      it("Should be participate ", async function () {
        const turn = 20;
        await myContract.participate(turn, { value: turn });
        const players = await myContract.getPlayers();
        expect(players.length).to.equal(20);
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
