const { expect } = require("chai");

describe("LaChain Name Service testing", function () {

  let owner, playerOne, playerTwo;
    
  beforeEach(async function () {
      [owner, userOne, userTwo] = await ethers.getSigners();
      LACNS = await ethers.getContractFactory("LACNameService");
      LACNSContract = await LACNS.deploy('');
  });

  it("Adding a new Domain as Owner", async function () {
    await LACNSContract.connect(owner).addDomainType('LAC');
    expect(await LACNSContract.checkDomainTypeAllowed('LAC')).to.equal(true);
  });

  it("Adding a new Domain not as Owner", async function () {
    await expect(LACNSContract.connect(userOne).addDomainType('LAC')).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Adding and Remove new Domain as Owner", async function () {
    await LACNSContract.connect(owner).addDomainType('LAC');
    await LACNSContract.connect(owner).removeDomainType('LAC');
    expect(await LACNSContract.checkDomainTypeAllowed('LAC')).to.equal(false);
  });

  it("Adding a new Domain as Owner and try to Remove as not Owner", async function () {
    await LACNSContract.connect(owner).addDomainType('LAC');
    await expect(LACNSContract.connect(userOne).removeDomainType('LAC')).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Checking domain not added yet", async function () {
    expect(await LACNSContract.checkDomainTypeAllowed('testing')).to.equal(false);
  });

  it("Checking domain not added yet by not Owner", async function () {
    expect(await LACNSContract.connect(userOne).checkDomainTypeAllowed('testing')).to.equal(false);
  });

  
});