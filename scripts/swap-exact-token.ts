import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// Define token and contract addresses
const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

// Define the holder address to impersonate
const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

const main = async () => {
    // Impersonate the USDC holder account
    await helpers.impersonateAccount(USDCHolder);
    const impersonatedSigner = await ethers.getSigner(USDCHolder);

    // Define the swap amounts
    const amountOut = ethers.parseUnits("2000", 6); // 2000 USDC (6 decimals)
    const amountIn = ethers.parseEther("1"); // 1 ETH (18 decimals)

    // Get contract instances for tokens and the Uniswap router
    const USDC = await ethers.getContractAt("IERC20", USDCAddress);
    const DAI = await ethers.getContractAt("IERC20", DAIAddress);
    const WETH = await ethers.getContractAt("IERC20", wethAddress);
    const ROUTER = await ethers.getContractAt("IUniswap", UNIRouter);

    // Approve the router to spend USDC on behalf of the impersonated account
    const approveTx = await USDC.connect(impersonatedSigner).approve(UNIRouter, amountOut);
    await approveTx.wait();

    // Fetch balances before the swap
    const ethBal = await impersonatedSigner.provider.getBalance(USDCHolder);
    const wethBal = await WETH.balanceOf(impersonatedSigner.address);
    const usdcBal = await USDC.balanceOf(impersonatedSigner.address);
    const daiBal = await DAI.balanceOf(impersonatedSigner.address);

    console.log("USDC Balance Before Swap:", ethers.formatUnits(usdcBal, 6));
    console.log("DAI Balance Before Swap:", ethers.formatUnits(daiBal, 18));

    // Set the deadline for the swap (10 minutes from now)
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    // Perform the swap: USDC -> DAI
    const swapTx = await ROUTER.connect(impersonatedSigner).swapExactTokensForTokens(
        amountOut, // Amount of USDC to swap
        0, // Minimum amount of DAI to receive (slippage tolerance)
        [USDCAddress, DAIAddress], // Swap path: USDC -> DAI
        impersonatedSigner.address, // Recipient address
        deadline // Transaction deadline
    );

    await swapTx.wait();

    // Fetch balances after the swap
    const usdcBalAfterSwap = await USDC.balanceOf(impersonatedSigner.address);
    const daiBalAfterSwap = await DAI.balanceOf(impersonatedSigner.address);

    console.log("-----------------------------------------------------------------");
    console.log("USDC Balance After Swap:", ethers.formatUnits(usdcBalAfterSwap, 6));
    console.log("DAI Balance After Swap:", ethers.formatUnits(daiBalAfterSwap, 18));
}

main().catch((error) => {
  console.error("Error in main function:", error);
  process.exitCode = 1;
});