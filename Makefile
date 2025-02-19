add-liquidity:
	npx hardhat run scripts/uniswap-script.ts --network localhost

remove-liquidity:
	npx hardhat run scripts/remove-liquidity.ts --network localhost

swap-liquidity:
	npx hardhat run scripts/swapExactToken.ts --network localhost