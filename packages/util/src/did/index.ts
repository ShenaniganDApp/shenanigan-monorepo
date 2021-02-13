import { IConnector } from '@walletconnect/types';
import { convertUtf8ToHex } from '@walletconnect/utils';
import { Wallet, utils } from 'ethers';
import { Base64 } from 'js-base64';
// import { v4 as uuidv4 } from "uuid";
import { v4 as uuidv4RN } from 'react-native-uuid';

const tokenDuration = 1000 * 60 * 60 * 24 * 7; // 7 days

type Claim = {
	iat: Date;
	exp: Date;
	iss: string;
	aud: string;
	tid: string;
};

export async function createToken(connector: IConnector, wallet: Wallet): Promise<string> {
	let address;
	if (connector.connected) {
		address = connector.accounts[0];
	} else if (wallet) {
		address = await wallet.getAddress();
	} else {
		throw Error('No web3 element provided');
	}

	const iat = +new Date();

	//@TODO handle non react-native uuid
	const claim = {
		iat: +new Date(),
		exp: iat + tokenDuration,
		iss: address,
		aud: 'shenanigan',
		tid: uuidv4RN(),
	};

	const serializedClaim = JSON.stringify(claim);
	let proof;
	if (connector.connected) {
		proof = await connector.signPersonalMessage([convertUtf8ToHex(serializedClaim), address]);
	} else {
		proof = await wallet.signMessage(serializedClaim);
	}
	console.log(Base64.encode(JSON.stringify([proof, serializedClaim])));

	return Base64.encode(JSON.stringify([proof, serializedClaim]));
}

export function verifyToken(token: string): Claim | null {
	try {
		const rawToken = Base64.decode(token);
		const [proof, rawClaim] = JSON.parse(rawToken);
		const claim: Claim = JSON.parse(rawClaim);
		const signerAddress = utils.verifyMessage(rawClaim, proof);

		if (signerAddress !== claim.iss) {
			return null;
		}
		return claim;
	} catch (e) {
		console.error('Token verification failed', e);
		return null;
	}
}
