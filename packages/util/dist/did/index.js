"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const utils_1 = require("@walletconnect/utils");
const ethers_1 = require("ethers");
const js_base64_1 = require("js-base64");
// import { v4 as uuidv4 } from "uuid";
const react_native_uuid_1 = require("react-native-uuid");
const tokenDuration = 1000 * 60 * 60 * 24 * 7; // 7 days
async function createToken(connector, wallet) {
  let address;
  if (connector.connected) {
    address = connector.accounts[0];
  } else if (wallet) {
    address = await wallet.getAddress();
  } else {
    throw Error("No web3 element provided");
  }
  const iat = +new Date();
  //@TODO handle non react-native uuid
  const claim = {
    iat: +new Date(),
    exp: iat + tokenDuration,
    iss: address,
    aud: "shenanigan",
    tid: react_native_uuid_1.v4(),
  };
  const serializedClaim = JSON.stringify(claim);
  let proof;
  if (connector.connected) {
    proof = await connector.signPersonalMessage([
      utils_1.convertUtf8ToHex(serializedClaim),
      address,
    ]);
  } else {
    proof = await wallet.signMessage(serializedClaim);
  }
  console.log(
    js_base64_1.Base64.encode(JSON.stringify([proof, serializedClaim]))
  );
  return js_base64_1.Base64.encode(JSON.stringify([proof, serializedClaim]));
}
exports.createToken = createToken;
function verifyToken(token) {
  try {
    const rawToken = js_base64_1.Base64.decode(token);
    const [proof, rawClaim] = JSON.parse(rawToken);
    const claim = JSON.parse(rawClaim);
    const signerAddress = ethers_1.utils.verifyMessage(rawClaim, proof);
    if (signerAddress !== claim.iss) {
      return null;
    }
    return claim;
  } catch (e) {
    console.error("Token verification failed", e);
    return null;
  }
}
exports.verifyToken = verifyToken;
//# sourceMappingURL=index.js.map
