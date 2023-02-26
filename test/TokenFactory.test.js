const { BN, constants, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { expect } = require('chai');
const { ZERO_ADDRESS, MAX_UINT256 } = constants;


const TokenFactory = artifacts.require("TokenFactory")
const Token = artifacts.require("Token")
const fromWei = (x) => web3.utils.fromWei(x.toString());
const toWei = (x) => web3.utils.toWei(x.toString());

contract('Token Factory', function (accounts) {

  const [deployer, firstAccount, secondAccount] = accounts;

  it('retrive deployed contracts', async function () {
    tokenFactoryContract = await TokenFactory.deployed();
    expect(tokenFactoryContract.address).to.be.not.equal(ZERO_ADDRESS);
    expect(tokenFactoryContract.address).to.match(/0x[0-9a-fA-F]{40}/);

  });

  it('deploy some tokens from factory', async function () {
    tx = await tokenFactoryContract.deployNewToken("First Test Token", "TT1", 5000000, firstAccount, { from: deployer });
    let TokenCounter = await tokenFactoryContract.getTokenCounter();
    console.log("Deployed Token Counter: " + TokenCounter.toString());
    let Token1Address = await tokenFactoryContract.getTokenAddress(TokenCounter-1);
    console.log("Deployed Token1 Address (from Token Factory): " + Token1Address);
    TokenContract1 = await Token.at(Token1Address)
    expect(TokenContract1.address).to.be.not.equal(ZERO_ADDRESS)
    expect(TokenContract1.address).to.match(/0x[0-9a-fA-F]{40}/);
    console.log(fromWei(await TokenContract1.totalSupply()));
    console.log(fromWei(await TokenContract1.balanceOf(firstAccount)));
    console.log(fromWei(await TokenContract1.balanceOf(tokenFactoryContract.address)));
    expect(await TokenContract1.owner()).to.be.equal(firstAccount);
    expect(await tokenFactoryContract.getTokenDeployed(Token1Address)).to.be.true;

    tx = await tokenFactoryContract.deployNewToken("Second Test Token", "TT2", 1000000, secondAccount, { from: deployer });
    TokenCounter = await tokenFactoryContract.getTokenCounter();
    console.log("Deployed Token Counter: " + TokenCounter.toString());
    let Token2Address = await tokenFactoryContract.getTokenAddress(TokenCounter-1);
    console.log("Deployed Token2 Address (from Token Factory): " + Token2Address);
    TokenContract2 = await Token.at(Token2Address)
    expect(TokenContract2.address).to.be.not.equal(ZERO_ADDRESS)
    expect(TokenContract2.address).to.match(/0x[0-9a-fA-F]{40}/);
    console.log(fromWei(await TokenContract2.totalSupply()));
    console.log(fromWei(await TokenContract2.balanceOf(secondAccount)));
    console.log(fromWei(await TokenContract2.balanceOf(tokenFactoryContract.address)));
    expect(await TokenContract2.owner()).to.be.equal(secondAccount);
    expect(await tokenFactoryContract.getTokenDeployed(Token2Address)).to.be.true;

  });

  it('distibute some tokens to TokenContract1', async function() {
    await TokenContract1.transfer(secondAccount, toWei(100000), {from: firstAccount});
    balDepl = await TokenContract1.balanceOf(deployer)
    balFA = await TokenContract1.balanceOf(firstAccount)
    balSA = await TokenContract1.balanceOf(secondAccount)

    console.log(fromWei(balDepl), fromWei(balFA), fromWei(balSA), );

  });

  
  it('distibute some tokens to TokenContract2', async function() {
    await TokenContract2.transfer(firstAccount, toWei(200000), {from: secondAccount});
    balDepl = await TokenContract2.balanceOf(deployer)
    balFA = await TokenContract2.balanceOf(firstAccount)
    balSA = await TokenContract2.balanceOf(secondAccount)

    console.log(fromWei(balDepl), fromWei(balFA), fromWei(balSA), );

  });


});
