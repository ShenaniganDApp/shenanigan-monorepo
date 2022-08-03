import { IConnector } from "@walletconnect/types";
import { Wallet } from "ethers";
declare type Claim = {
  iat: Date;
  exp: Date;
  iss: string;
  aud: string;
  tid: string;
};
export declare function createToken(
  connector: IConnector,
  wallet: Wallet
): Promise<string>;
export declare function verifyToken(token: string): Claim | null;
export {};
//# sourceMappingURL=index.d.ts.map
