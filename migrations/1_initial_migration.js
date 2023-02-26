const TokenFactory = artifacts.require("TokenFactory")
 
module.exports = async(deployer, network, accounts) => {
    await deployer.deploy(TokenFactory)
    const tokenFactory = await TokenFactory.deployed()
    console.log("Deployed TokenFactory contract @ :", tokenFactory.address)

}