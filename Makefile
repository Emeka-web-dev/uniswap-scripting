add-liquidity:
	npx hardhat run scripts/uniswap-script.ts --network localhost

swap-liquidity:
	npx hardhat run scripts/swap-exact-token.ts --network localhost

