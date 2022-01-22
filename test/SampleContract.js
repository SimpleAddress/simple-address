const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Contract", () => {
  let SampleContract, sampleContract;

  beforeEach(async () => {
    SampleContract = await ethers.getContractFactory("SampleContract");
    sampleContract = await SampleContract.deploy();
  });

  it("The owner cannot use the same simple name as an existing one", async () => {
    // TODO
  });

  it("The owner can create a simple name", async () => {
    // TODO
  });
  it("The owner has a new address book when they create a simple name", async () => {
    // TODO
  });

  it("The owner appends the address to the array of the new struct", async () => {
    // TODO
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
