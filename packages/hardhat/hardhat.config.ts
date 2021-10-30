/* eslint-disable import/no-extraneous-dependencies */
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import '@nomiclabs/hardhat-web3';

import { ethers } from 'ethers';
import fs from 'fs';
import { task } from 'hardhat/config';
import { HardhatUserConfig } from 'hardhat/types';

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			blockGasLimit: 100000000000,
      gas: 100000000
		},
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/62fd1818438846a984542dd3520611c4",
      accounts: ["de1742662b56bb05f84ec9a5f4ef2c9614a1b6579afa3d2200a81cc4c63f21ca"]
    }
	},
	solidity: {
		version: '0.8.0',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	namedAccounts: {
		deployer: 0,
		tester: 1,
	},
	paths: {
		sources: 'src',
	},
};

task('generate', 'Create a mnemonic for hardhat deploys', async () => {
	const bip39 = require('bip39');
	const hdkey = require('ethereumjs-wallet/hdkey');
	const mnemonic = bip39.generateMnemonic();
	const seed = await bip39.mnemonicToSeed(mnemonic);
	const hdwallet = hdkey.fromMasterSeed(seed);
	const wallethdpath = "m/44'/60'/0'/0/";
	const accountindex = 0;
	const fullPath = wallethdpath + accountindex;
	const wallet = hdwallet.derivePath(fullPath).getWallet();
	const privateKey = `0x${wallet._privKey.toString('hex')}`;
	const EthUtil = require('ethereumjs-util');
	const address = `0x${EthUtil.privateToAddress(wallet._privKey).toString('hex')}`;
	console.log(`🔐 Account Generated as ${address}.txt and set as DEPLOY_ACCOUNT in packages/buidler`);
	console.log("💬 Use 'yarn run account' to get more information about the deployment account.");

	fs.writeFileSync(`./${address}.txt`, mnemonic.toString());
	fs.writeFileSync('./DEPLOY_ACCOUNT.txt', mnemonic.toString());
});

task('select', 'Activate one of the deploying accounts (just switchs mnemonic files around)')
	.addPositionalParam(
		'address',
		"The account's address. (should be an *address*.txt file here already from the `generate` task)"
	)
	.setAction(async (taskArgs) => {
		console.log('Selecting account ', taskArgs);
		const mnemonic = fs.readFileSync(`./${taskArgs.address}.txt`).toString().trim();
		fs.writeFileSync('./DEPLOY_ACCOUNT.txt', mnemonic);
		console.log('SELECTED:', taskArgs.address);
	});

task('accounts', 'Prints the list of accounts', async (args, hre) => {
	const accounts = await hre.ethers.getSigners();
	accounts.forEach((account) => console.info(account.address));
});

task('blockNumber', 'Prints the block number', async (args, hre) => {
	const blockNumber = await hre.ethers.provider.getBlockNumber();
	console.log(blockNumber);
});

task('balance', "Prints an account's balance")
	.addPositionalParam('account', "The account's address")
	.setAction(async (taskArgs, hre) => {
		const balance = await (await hre.ethers.getSigner(taskArgs.account)).getBalance();
		console.log(hre.ethers.utils.formatEther(balance.toString()), 'ETH');
	});

task('send', 'Send ETH')
	.addParam('from', 'From address or account index')
	.addOptionalParam('to', 'To address or account index')
	.addOptionalParam('amount', 'Amount to send in ether')
	.addOptionalParam('data', 'Data included in transaction')
	.addOptionalParam('gasPrice', 'Price you are willing to pay in gwei')
	.addOptionalParam('gasLimit', 'Limit of how much gas to spend')

	.setAction(async (taskArgs, hre) => {
		const wallet = await hre.ethers.getSigner(taskArgs.from);
		const addressTo = taskArgs.address;

		console.log(`Attempting to send transaction from ${wallet.address} to ${addressTo}`);

		// Create Tx Object
		const tx = {
			to: addressTo,
			value: ethers.utils.parseEther(taskArgs.amount || '0'),
			gasPrice: ethers.utils.parseUnits(taskArgs.gasPrice || '1', 'gwei'),
			gas: taskArgs.gasLimit || '2400',
			data: taskArgs.data || undefined,
		};

		// Sign and Send Tx - Wait for Receipt
		const createReceipt = await wallet.sendTransaction(tx);
		await createReceipt.wait();
		console.log(`Transaction successful with hash: ${createReceipt.hash}`);
	});

// eslint-disable-next-line import/no-default-export
export default config;
