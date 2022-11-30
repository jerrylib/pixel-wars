const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("My Dapp", function () {
  let myContract;

  describe("PixelWar", function () {
    it("Should deploy PixelWar", async function () {
      const PixelWarContract = await ethers.getContractFactory("PixelWar");

      myContract = await PixelWarContract.deploy(100, 100);
    });

    describe("update()", function () {
      it("Should be update new color", async function () {
        await myContract.update(1, 2, "#ddd");
      });
    });
    describe("getMap()", function () {
      it("getMap() return new Array", async function () {
        const result = await myContract.getColor(1, 2);
        expect(result).to.equal("#ddd");
      });
    });
  });
});
