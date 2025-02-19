import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    
    const theAddressIFoundWithUSDCAndDAI = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

    // Get the LP token address for the USDC-DAI pair
    const UNIFactory = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
    const factoryContract = await ethers.getContractAt('IUniswapV2Factory', UNIFactory);
    const lpTokenAddress = await factoryContract.getPair(USDCAddress, DAIAddress);

    // Amount of LP tokens to remove
    let liquidityAmount = ethers.parseUnits('10', 18); // Adjust based on your LP token balance
    let AmtAMin = ethers.parseUnits('0', 6);  // Minimum USDC to receive
    let AmtBMin = ethers.parseUnits('0', 18); // Minimum DAI to receive
    
    let deadline = await helpers.time.latest() + 500;

    await helpers.impersonateAccount(theAddressIFoundWithUSDCAndDAI);
    const impersonatedSigner = await ethers.getSigner(theAddressIFoundWithUSDCAndDAI);

    let usdcContract = await ethers.getContractAt('IERC20', USDCAddress);
    let daiContract = await ethers.getContractAt('IERC20', DAIAddress);
    let lpTokenContract = await ethers.getContractAt('IERC20', lpTokenAddress);
    let uniswapContract = await ethers.getContractAt('IUniswap', UNIRouter);

    // Get initial balances
    const usdcBal = await usdcContract.balanceOf(impersonatedSigner.address);
    const daiBal = await daiContract.balanceOf(impersonatedSigner.address);
    const lpBal = await lpTokenContract.balanceOf(impersonatedSigner.address);

    console.log('Initial USDC balance:', ethers.formatUnits(usdcBal, 6));
    console.log('Initial DAI balance:', ethers.formatUnits(daiBal, 18));
    console.log('Initial LP token balance:', ethers.formatUnits(lpBal, 18));

    // Approve router to spend LP tokens
    await lpTokenContract.connect(impersonatedSigner).approve(UNIRouter, liquidityAmount);

    console.log('-------------------------- Removing liquidity -------------');

    // Remove liquidity
    await uniswapContract.connect(impersonatedSigner).removeLiquidity(
        USDCAddress,
        DAIAddress,
        liquidityAmount,
        AmtAMin,
        AmtBMin,
        impersonatedSigner.address,
        deadline
    );

    console.log('-------------------------- Liquidity removed -------------');

    // Get final balances
    const usdcBalAfter = await usdcContract.balanceOf(impersonatedSigner.address);
    const daiBalAfter = await daiContract.balanceOf(impersonatedSigner.address);
    const lpBalAfter = await lpTokenContract.balanceOf(impersonatedSigner.address);

    console.log('Final USDC balance:', ethers.formatUnits(usdcBalAfter, 6));
    console.log('Final DAI balance:', ethers.formatUnits(daiBalAfter, 18));
    console.log('Final LP token balance:', ethers.formatUnits(lpBalAfter, 18));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});