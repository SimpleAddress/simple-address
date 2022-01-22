const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleAddressCore", () => {
  let SimpleAddressCore;
  let owner;
  let address1;

  beforeEach(async () => {
    SimpleAddressCore = await ethers.getContractFactory("SimpleAddressCore");
    accounts = await ethers.getSigners();
    owner = accounts[0];
    address1 = accounts[1];
    address2 = accounts[2];
    address3 = accounts[3];

    simpleAddressCore = await SimpleAddressCore.deploy();
    await simpleAddressCore.deployed();
  });

  describe("getSimpleName", function () {
    it("The owner cannot use the same simple name as an existing one for a different address", async () => {
      // Create two simplenames that are the same
      let simpleName1 = "simpleName";
      let simpleName2 = "simpleName";

      // Deploy the first simple name
      await simpleAddressCore
        .connect(owner)
        .getSimpleName(address1["address"], simpleName1);
    });

    it("The owner can create a simple name", async () => {
      // Create two simplenames that are the same
      let simpleName1 = "simpleName";

      // Deploy the first simple name
      await expect(
        simpleAddressCore
          .connect(owner)
          .getSimpleName(address1["address"], simpleName1)
      )
        .to.emit(simpleAddressCore, "simpleAddressCreated")
        .withArgs(address1["address"], simpleName1);
    });

    it("The owner has a new address book when they create a simple name", async () => {
      // Create two simplenames that are the same
      let simpleName1 = "simpleName";

      // Deploy the first simple name
      await expect(
        simpleAddressCore
          .connect(owner)
          .getSimpleName(address1["address"], simpleName1)
      )
        .to.emit(simpleAddressCore, "simpleAddressCreated")
        .withArgs(address1["address"], simpleName1);
    });

    it("The owner appends the address to the array of the new struct", async () => {
      // TODO
    });
  });
  it("The owner can successfully append a second address", async () => {
    // TODO
  });

  it("The owner cannot add an unverified address", async () => {
    // TODO
  });
  it("The owner cannot add an address that already exists on another simple address", async () => {
    // TODO
  });

  it("The contract can verify an unverified connection with subAccount", async () => {
    // TODO
  });
  it("The contract can verify an unverified connection with a metaAccount", async () => {
    // TODO
  });
  it("The contract can retrieve and view aggregated data for a metaAccount", async () => {
    // TODO
  });
});
``;
