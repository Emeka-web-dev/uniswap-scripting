import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const whaleAddress = "0x28C6c06298d514Db089934071355E5743bf21d60"; // Address with LP tokens
    const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"; // Uniswap V2 factory address
    // const pairAddress = "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852"; // USDC-ETH pair address

    

    
   
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});