const { expect } = require("chai");

describe("LaChain Name Service testing Domain", function () {

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

  it("Add domain, buy name and remove domain", async function () {
    await LACNSContract.connect(owner).addDomainType('LAC');
    await LACNSContract.connect(userOne).register('fer', 'LAC', 1, userOne.address, {value: '800000000000000000'});
    await LACNSContract.connect(owner).removeDomainType('LAC');
    expect(await LACNSContract.connect(userOne).checkDomainTypeAllowed('LAC')).to.equal(false);
  });
  
});

describe("LaChain Name Service testing Register", function () {

  let owner, playerOne, playerTwo;
    
  beforeEach(async function () {
      [owner, userOne, userTwo] = await ethers.getSigners();
      LACNS = await ethers.getContractFactory("LACNameService");
      LACNSContract = await LACNS.deploy('');
      await LACNSContract.connect(owner).addDomainType('lac');
      await LACNSContract.connect(owner).addDomainType('ripio');
      await LACNSContract.connect(owner).addDomainType('sensei');
      await LACNSContract.connect(owner).addDomainType('num');
      await LACNSContract.connect(owner).addDomainType('cedalio');
      await LACNSContract.connect(owner).addDomainType('buenbit');
      await LACNSContract.connect(owner).addDomainType('foxbit');
  });


  it("Register a new Name with 3 letters", async function () {
    const latestBlock = await ethers.provider.getBlock('latest');
    const adjustedTimestamp = latestBlock.timestamp + 60 + 1; // Adjust timestamp as needed
  
    await expect(LACNSContract.connect(userOne).register('fer', 'lac', 1, userOne.address, {value: '800000000000000000'}))
      .to.emit(LACNSContract, 'Register')
      .withArgs(
        'fer.lac', 
        userOne.address, 
        userOne.address, 
        "", "", "", "", 
        adjustedTimestamp, 
        2
      );
  });

  it("Register a new Name with 4 letters", async function () {
    const latestBlock = await ethers.provider.getBlock('latest');
    const adjustedTimestamp = latestBlock.timestamp + 60 + 1; // Adjust timestamp as needed
  
    await expect(LACNSContract.connect(userOne).register('fern', 'lac', 1, userOne.address, {value: '600000000000000000'}))
      .to.emit(LACNSContract, 'Register')
      .withArgs(
        'fern.lac', 
        userOne.address, 
        userOne.address, 
        "", "", "", "", 
        adjustedTimestamp, 
        2
      );
  });

  it("Register a new Name with 5 letters", async function () {
    const latestBlock = await ethers.provider.getBlock('latest');
    const adjustedTimestamp = latestBlock.timestamp + 60 + 1;
  
    await expect(LACNSContract.connect(userOne).register('ferna', 'ripio', 1, userOne.address, {value: '450000000000000000'}))
      .to.emit(LACNSContract, 'Register')
      .withArgs(
        'ferna.ripio', 
        userOne.address, 
        userOne.address, 
        "", "", "", "", 
        adjustedTimestamp, 
        2
      );
  });

  it("Register a new Name with 3 letters and other one wants to register", async function () {  
    await LACNSContract.connect(userOne).register('fer', 'num', 1, userOne.address, {value: '800000000000000000'});
    await expect(LACNSContract.connect(userTwo).register('fer', 'num', 1, userTwo.address, {value: '800000000000000000'})).to.be.revertedWith('Error: Domain is not available for registration.')
  });

  it("Register a new Name with 4 letters and other one wants to register", async function () {  
    await LACNSContract.connect(userOne).register('fern', 'num', 1, userOne.address, {value: '600000000000000000'});
    await expect(LACNSContract.connect(userTwo).register('fern', 'num', 1, userTwo.address, {value: '600000000000000000'})).to.be.revertedWith('Error: Domain is not available for registration.')
  });

  it("Register a new Name with 5 letters and other one wants to register", async function () {  
    await LACNSContract.connect(userOne).register('ferna', 'cedalio', 1, userOne.address, {value: '450000000000000000'});
    await expect(LACNSContract.connect(userTwo).register('ferna', 'cedalio', 1, userTwo.address, {value: '450000000000000000'})).to.be.revertedWith('Error: Domain is not available for registration.')
  });

  it("Register a new Name with invalid Domain", async function () {  
    await expect(LACNSContract.connect(userOne).register('ferna', 'testing', 1, userOne.address, {value: '450000000000000000'})).to.be.revertedWith('Error: Domain type is not allowed.')
  });

  it("Register the same Name with two different Domains", async function () {
    const latestBlock = await ethers.provider.getBlock('latest');
    const adjustedTimestamp = latestBlock.timestamp + 60 + 2; 

    await expect(LACNSContract.connect(userOne).register('ferna', 'ripio', 1, userOne.address, {value: '450000000000000000'}));
    await expect(LACNSContract.connect(userTwo).register('ferna', 'lac', 1, userTwo.address, {value: '450000000000000000'}))
      .to.emit(LACNSContract, 'Register')
      .withArgs(
        'ferna.lac', 
        userTwo.address, 
        userTwo.address, 
        "", "", "", "", 
        adjustedTimestamp, 
        3
      );  
    });

    it("Register a new Name with Paused Contract", async function () {
      await LACNSContract.connect(owner).changePaused();
      await expect(LACNSContract.connect(userOne).register('ferna', 'lac', 1, userOne.address, {value: '450000000000000000'})).to.be.revertedWith('Error: Contract is currently paused.')
    });

    it("Register a new Name with Unpaused Contract", async function () {
      await LACNSContract.connect(owner).changePaused();
      await LACNSContract.connect(owner).changePaused();
      const latestBlock = await ethers.provider.getBlock('latest');
      const adjustedTimestamp = latestBlock.timestamp + 60 + 1;
    
      await expect(LACNSContract.connect(userOne).register('ferna', 'ripio', 1, userOne.address, {value: '450000000000000000'}))
        .to.emit(LACNSContract, 'Register')
        .withArgs(
          'ferna.ripio', 
          userOne.address, 
          userOne.address, 
          "", "", "", "", 
          adjustedTimestamp, 
          2
        );    
      });

      it("Register a new Name with Less than a year", async function () {
        await expect(LACNSContract.connect(userOne).register('ferna', 'lac', 0, userOne.address, {value: '450000000000000000'})).to.be.revertedWith('Error: Invalid registration year, year must be greater than or equal to 1.')
      });

      it("Register a new Name with 5 years", async function () {
        const latestBlock = await ethers.provider.getBlock('latest');
        const adjustedTimestamp = latestBlock.timestamp +  60 * 5 + 1;
      
        await expect(LACNSContract.connect(userOne).register('ferna', 'ripio', 5, userOne.address, {value: '2250000000000000000'}))
          .to.emit(LACNSContract, 'Register')
          .withArgs(
            'ferna.ripio', 
            userOne.address, 
            userOne.address, 
            "", "", "", "", 
            adjustedTimestamp, 
            2
          );
      });

      it("Register a new Name with Less Money", async function () {
        await expect(LACNSContract.connect(userOne).register('ferna', 'lac', 1, userOne.address, {value: '400000000000000000'})).to.be.revertedWith('Error: Not enough value sent with the transaction.')
      });
      
      it("Register a new Name with More Money", async function () {
        const latestBlock = await ethers.provider.getBlock('latest');
        const adjustedTimestamp = latestBlock.timestamp +  60 + 1;
      
        await expect(LACNSContract.connect(userOne).register('ferna', 'ripio', 1, userOne.address, {value: '650000000000000000'}))
          .to.emit(LACNSContract, 'Register')
          .withArgs(
            'ferna.ripio', 
            userOne.address, 
            userOne.address, 
            "", "", "", "", 
            adjustedTimestamp, 
            2
          );
      });

      it("Register a new Name with other address as resolver", async function () {
        const latestBlock = await ethers.provider.getBlock('latest');
        const adjustedTimestamp = latestBlock.timestamp +  60 + 1;
      
        await expect(LACNSContract.connect(userOne).register('ferna', 'ripio', 1, userTwo.address, {value: '450000000000000000'}))
          .to.emit(LACNSContract, 'Register')
          .withArgs(
            'ferna.ripio', 
            userOne.address, 
            userTwo.address, 
            "", "", "", "", 
            adjustedTimestamp, 
            2
          );
      });

      it("Register a new Name free as Owner", async function () {
        const latestBlock = await ethers.provider.getBlock('latest');
        const adjustedTimestamp = latestBlock.timestamp +  60 + 1;
      
        await expect(LACNSContract.connect(owner).register('ferna', 'ripio', 1, owner.address))
          .to.emit(LACNSContract, 'Register')
          .withArgs(
            'ferna.ripio', 
            owner.address, 
            owner.address, 
            "", "", "", "", 
            adjustedTimestamp, 
            2
          );
      });

});

describe("LaChain Name Service testing Change Data", function () {

  let owner, playerOne, playerTwo;
    
  beforeEach(async function () {
      [owner, userOne, userTwo] = await ethers.getSigners();
      LACNS = await ethers.getContractFactory("LACNameService");
      LACNSContract = await LACNS.deploy('');
      await LACNSContract.connect(owner).addDomainType('lac');
      await LACNSContract.connect(owner).addDomainType('ripio');
      await LACNSContract.connect(owner).addDomainType('sensei');
      await LACNSContract.connect(owner).addDomainType('num');
      await LACNSContract.connect(owner).addDomainType('cedalio');
      await LACNSContract.connect(owner).addDomainType('buenbit');
      await LACNSContract.connect(owner).addDomainType('foxbit');
  });

  it("Change Personal Info of User", async function () {  
    await LACNSContract.connect(userOne).register('fer', 'num', 1, userOne.address, {value: '800000000000000000'});
    await expect(LACNSContract.connect(userOne).changePersonalInfo('fer','num','fer.jpg','fer@mail.com','@fergmolina', '@fergmolina'))
    .to.emit(LACNSContract, 'PersonalInfoChanged')
    .withArgs(
      'fer.num',
      'fer.jpg',
      'fer@mail.com',
      "@fergmolina",
      "@fergmolina"
    )
  });

  it("Change Personal Info of another User", async function () {  
    await LACNSContract.connect(userOne).register('fer', 'num', 1, userOne.address, {value: '800000000000000000'});
    await expect(LACNSContract.connect(userTwo).changePersonalInfo('fer','num','fer.jpg','fer@mail.com','@fergmolina', '@fergmolina')).to.be.revertedWith('Only the owner of the domain can change the personal information');
  });

  it("Change Personal Info of another User as owner", async function () {  
    await LACNSContract.connect(userOne).register('fer', 'num', 1, userOne.address, {value: '800000000000000000'});
    await expect(LACNSContract.connect(owner).changePersonalInfo('fer','num','fer.jpg','fer@mail.com','@fergmolina', '@fergmolina')).to.be.revertedWith('Only the owner of the domain can change the personal information');
  });

  it("Change Personal Info of User and check func", async function () {  
    await LACNSContract.connect(userOne).register('fer', 'num', 1, userOne.address, {value: '800000000000000000'});
    await LACNSContract.connect(userOne).changePersonalInfo('fer','num','fer.jpg','fer@mail.com','@fergmolina', '@fergmolina');
    user = await LACNSContract.resolve('fer.num');
    expect(user[2]).to.equal('fer.jpg');
    expect(user[3]).to.equal('fer@mail.com');
    expect(user[4]).to.equal('@fergmolina');
    expect(user[5]).to.equal('@fergmolina');
  });

  it("Change Resolve Address of User", async function () {  
    await LACNSContract.connect(userOne).register('fer', 'num', 1, userOne.address, {value: '800000000000000000'});
    await expect(LACNSContract.connect(userOne).changeResolve('fer','num',userTwo.address))
    .to.emit(LACNSContract, 'ResolveChanged')
    .withArgs(
      'fer.num',
      userTwo.address
    )
  });

  it("Change Resolve Addressof another User", async function () {  
    await LACNSContract.connect(userOne).register('fer', 'num', 1, userOne.address, {value: '800000000000000000'});
    await expect(LACNSContract.connect(userTwo).changeResolve('fer','num',userTwo.address)).to.be.revertedWith('Only the owner of the domain can change the resolve address');
  });

  it("Change Resolve Address of another User as owner", async function () {  
    await LACNSContract.connect(userOne).register('fer', 'num', 1, userOne.address, {value: '800000000000000000'});
    await expect(LACNSContract.connect(owner).changeResolve('fer','num',userTwo.address)).to.be.revertedWith('Only the owner of the domain can change the resolve address');
  });

  it("Change Resolve Address of User and check func", async function () {  
    await LACNSContract.connect(userOne).register('fer', 'num', 1, userOne.address, {value: '800000000000000000'});
    await LACNSContract.connect(userOne).changeResolve('fer','num',userTwo.address);
    user = await LACNSContract.resolve('fer.num');
    expect(user[0]).to.equal(userTwo.address);
  });

});