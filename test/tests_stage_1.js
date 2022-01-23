const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Contract", () => {
    let SimpleAddress, simpleAddress;

    beforeEach(async () => {
        SimpleAddress = await ethers.getContractFactory("SimpleAddressCore");
        simpleAddress = await SimpleAddress.deploy();
        signers= await ethers.getSigners();
        meta=signers.slice(0,3); //Three meta accounts
        account=signers.slice(3,8); //Five sub accounts
    });

    //List of Names in case you run out of creativity for creating simple names
    //Putin
    //Curie
    //Marx
    //Serena
    //Bose
    //Obama
    //Ronaldinho
    //Salman
    //Einstien
    //Pichai
    //Oprah
    //Jobs
    //Jackson
    //Greta
    //Jordan
    //Bohr
    
    describe("Simple Name Registrations", () => {
        it("should allow simple name registration from a fresh address", async () => {
            simpleName="putin.simple"
            expect(await simpleAddress.connect(meta[0]).registerAddress(simpleName))
                .to
                .emit(simpleAddress, "Registered")
                .withArgs(meta[0].address,simpleName);
        });
        it("should disallow the same meta address from registering again", async () => {
            simpleName="putin.simple"
            await simpleAddress.connect(meta[0]).registerAddress(simpleName)
            simpleName="curie.simple"
            await expect(
                simpleAddress.connect(meta[0]).registerAddress(simpleName)
                ).to.be.revertedWith("Address already registered");
        });
        it("should disallow the same name being taken by another account", async () => {
            simpleName="putin.simple"
            await simpleAddress.connect(meta[0]).registerAddress(simpleName)
            await expect(
                simpleAddress.connect(meta[1]).registerAddress(simpleName)
                ).to.be.revertedWith("Name not available");
        });
        it("should disallow an existing sub address from registering as a meta address", async () => {
            simpleName="putin.simple"
            await simpleAddress.connect(meta[0]).registerAddress(simpleName)
            await simpleAddress.connect(account[0]).associate(meta[0].address, account[0].address)
            await simpleAddress.connect(meta[0]).approve(meta[0].address, account[0].address)
            await expect(
                simpleAddress.connect(account[0]).registerAddress(simpleName)
                ).to.be.revertedWith("Address already within Meta address(es)");
        });

        

    });

});