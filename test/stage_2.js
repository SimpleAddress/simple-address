const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sample Contract", () => {
    let SimpleAddress, simpleAddress;

    beforeEach(async () => {
        SimpleAddress = await ethers.getContractFactory("SimpleAddressCore");
        simpleAddress = await SimpleAddress.deploy();
        simpleName=["putin.simple", "Marx.simple", "Bose", "Obama", "Ronaldinho", "Salman"];
        signers= await ethers.getSigners();
        meta=signers.slice(0,3); //Three meta accounts
        account=signers.slice(3,8); //Five sub accounts
        thirdparty=signers.slice(8,10); //Two third-party accounts
    });
    
    describe("Simple Name Registrations", () => {
        it("should allow simple name registration from a fresh address", async () => {
            expect(await simpleAddress.connect(meta[0]).registerAddress(simpleName[0]))
                .to
                .emit(simpleAddress, "Registered")
                .withArgs(meta[0].address,simpleName[0]);
        });
        it("should disallow the same meta address from registering again", async () => {
            await simpleAddress.connect(meta[0]).registerAddress(simpleName[0])
            await expect(
                simpleAddress.connect(meta[0]).registerAddress(simpleName[1])
                ).to.be.revertedWith("Address already registered");
        });
        it("should disallow the same name being taken by another account", async () => {
            await simpleAddress.connect(meta[0]).registerAddress(simpleName[0])
            await expect(
                simpleAddress.connect(meta[1]).registerAddress(simpleName[0])
                ).to.be.revertedWith("Name not available");
        });
        it("should disallow an existing sub address from registering as a meta address", async () => {
            await simpleAddress.connect(meta[0]).registerAddress(simpleName[0])
            await simpleAddress.connect(account[0]).approve(meta[0].address, account[0].address)
            await simpleAddress.connect(meta[0]).approve(meta[0].address, account[0].address)
            await expect(
                simpleAddress.connect(account[0]).registerAddress(simpleName[1])
                ).to.be.revertedWith("Address already within Meta address(es)");
        });
    });

    describe("Sub Accounts Association", () => {
        it("should allow simple name to associate a new sub address", async () => {
            await simpleAddress.connect(meta[0]).registerAddress(simpleName[0]);
            expect(await simpleAddress.connect(meta[0]).approve(meta[0].address, account[0].address))
                .to
                .emit(simpleAddress, "Approved")
                .withArgs(meta[0].address,account[0].address, meta[0].address);  // returns meta, sub, msg.sender
        });
        it("should not allow third party address to create aprovals", async () => {
            await simpleAddress.connect(meta[0]).registerAddress(simpleName[0]);
            await expect( 
                simpleAddress.connect(thirdparty[0]).approve(meta[0].address, account[0].address)
                ).to.be.revertedWith("Insufficient access for approval");
        });
        it("should not allow a non-meta address to associate a new sub address", async () => {
            await expect(
                simpleAddress.connect(meta[0]).approve(meta[0].address, account[0].address)
                ).to.be.revertedWith("Invalid Meta address");
        });
        it("should not allow a meta address to be passed as sub address", async () => {
            await simpleAddress.connect(meta[0]).registerAddress(simpleName[0]);
            await simpleAddress.connect(meta[1]).registerAddress(simpleName[1]);
            await expect(
                simpleAddress.connect(meta[1]).approve(meta[1].address, meta[0].address)
                ).to.be.revertedWith("Invalid Sub address. A Meta address cannot be a Sub address");
        });
        it("should not allow simple name to associate with duplicated sub address", async () => {
            await simpleAddress.connect(meta[0]).registerAddress(simpleName[0]);
            await simpleAddress.connect(meta[0]).approve(meta[0].address, account[0].address);
            await expect( 
                simpleAddress.connect(meta[0]).approve(meta[0].address, account[0].address)
                ).to.be.revertedWith("Approval already exists");
        });
    });

    describe("Approving Connections", () => {
        it("should allow sub address to approve connection to a simple name", async () => {
            await simpleAddress.connect(meta[0]).registerAddress(simpleName[0]);
            await simpleAddress.connect(meta[0]).approve(meta[0].address, account[0].address);
            expect(await simpleAddress.connect(account[0]).approve(meta[0].address, account[0].address))
                .to
                .emit(simpleAddress, "Approved")
                .withArgs(meta[0].address, account[0].address, account[0].address);  // returns meta, sub, msg.sender
        });
        it("should revert if third-party tries to approve connection bwtween simple name and sub address", async () => {
            await simpleAddress.connect(meta[0]).registerAddress(simpleName[0]);
            await simpleAddress.connect(meta[0]).approve(meta[0].address, account[0].address);
            await expect(
                simpleAddress.connect(thirdparty[0]).approve(meta[0].address, account[0].address)
                ).to.be.revertedWith("Insufficient access for approval");
        });
        it("should revert if meta address is not registered under a simple name", async () => {
            await expect(
                simpleAddress.connect(meta[0]).approve(meta[0].address, account[0].address)
                ).to.be.revertedWith("Invalid Meta address");
        });
        it("should revert if meta address is passed as a sub address", async () => {
            await simpleAddress.connect(meta[0]).registerAddress(simpleName[0]);
            await simpleAddress.connect(meta[1]).registerAddress(simpleName[1]);
            await expect(
              simpleAddress.connect(meta[1]).approve(meta[1].address, meta[0].address)
              ).to.be.revertedWith("Invalid Sub address. A Meta address cannot be a Sub address");
        });
        // Third parties can create public associations but cannot create approvals
    //     it("should revert trying to approve an unknown connection", async () => {
    //         await simpleAddress.connect(meta[0]).registerAddress(simpleName[0]);
    //         await expect(
    //           simpleAddress.connect(meta[0]).approve(meta[0].address, account[0].address)
    //           ).to.be.revertedWith("No association available to approve");
    //   }); 
      });

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