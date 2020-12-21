const fs = require('fs');
const chalk = require('chalk');
const { config, ethers } = require('@nomiclabs/buidler');
const diamond = require('diamond-util');

function addCommas(nStr) {
	nStr += '';
	const x = nStr.split('.');
	let x1 = x[0];
	const x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function strDisplay(str) {
	return addCommas(str.toString());
}

// async function autoDeploy() {
// 	const contractList = fs.readdirSync(config.paths.sources);
// 	return contractList
// 		.filter((fileName) => isSolidity(fileName) && isNotInterface(fileName))
// 		.reduce((lastDeployment, fileName) => {
// 			const contractName = fileName.replace('.sol', '');
// 			const args = readArgumentsFile(contractName);

// 			// Wait for last deployment to complete before starting the next
// 			return lastDeployment.then((resultArrSoFar) =>
// 				deploy(contractName, args).then((result) => [...resultArrSoFar, result])
// 			);
// 		}, Promise.resolve([]));
// }

async function main() {
	console.log('📡 Deploy \n');
	// auto deploy to read contract directory and deploy them all (add ".args" files for arguments)
	// await autoDeploy();
	// OR

	const accounts = await ethers.getSigners();
	const account = await accounts[0].getAddress();
	console.log('Account: ' + account);
	console.log('---');
	let tx;
	let totalGasUsed = ethers.BigNumber.from('0');
	let receipt;

	async function deployFacets(...facets) {
		const instances = [];
		for (let facet of facets) {
			let constructorArgs = [];
			if (Array.isArray(facet)) {
				[facet, constructorArgs] = facet;
			}
			const factory = await ethers.getContractFactory(facet);
			const facetInstance = await factory.deploy(...constructorArgs);
			await facetInstance.deployed();
			const tx = facetInstance.deployTransaction;
			const receipt = await tx.wait();
			console.log(`${facet} deploy gas used:` + strDisplay(receipt.gasUsed));
			totalGasUsed = totalGasUsed.add(receipt.gasUsed);
			instances.push(facetInstance);
		}
		return instances;
	}
	let [
		diamondCutFacet,
		diamondLoupeFacet,
		ownershipFacet,
		baseChallengeFacet,
		challengeTokenFacet,
	] = await deployFacets(
		'DiamondCutFacet',
		'DiamondLoupeFacet',
		'OwnershipFacet',
		'BaseChallengeFacet',
		'ChallengeTokenFacet'
	);

	const challengeDiamond = await diamond.deploy({
		diamondName: 'ChallengeDiamond',
		facets: [
			['DiamondCutFacet', diamondCutFacet],
			['DiamondLoupeFacet', diamondLoupeFacet],
			['OwnershipFacet', ownershipFacet],
			['BaseChallengeFacet', baseChallengeFacet],
			['ChallengeTokenFacet', challengeTokenFacet],
		],
		args: [account],
	});
	console.log('Challenge diamond address:' + challengeDiamond.address);

	tx = challengeDiamond.deployTransaction;
	receipt = await tx.wait();
	console.log('Challenge diamond deploy gas used:' + strDisplay(receipt.gasUsed));
	totalGasUsed = totalGasUsed.add(receipt.gasUsed);

	diamondLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', challengeDiamond.address);
	baseChallengeFacet = await ethers.getContractAt('BaseChallengeFacet', challengeDiamond.address);
	challengeTokenFacet = await ethers.getContractAt('ChallengeTokenFacet', challengeDiamond.address);

	// eslint-disable-next-line no-unused-vars

	console.log('Total gas used: ' + strDisplay(totalGasUsed));
	return {
		account: account,
		challengeDiamond: challengeDiamond,
		diamondLoupeFacet: diamondLoupeFacet,
		baseChallengeFacet: baseChallengeFacet,
		challengeTokenFxacet: challengeTokenFacet,
	};
	// custom deploy (to use deployed addresses dynamically for example:)
	// const exampleToken = await deploy("ExampleToken")
	// const examplePriceOracle = await deploy("ExamplePriceOracle")
	// const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
	main()
		.then(() => process.exit(0))
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
}

exports.deployProject = main;
