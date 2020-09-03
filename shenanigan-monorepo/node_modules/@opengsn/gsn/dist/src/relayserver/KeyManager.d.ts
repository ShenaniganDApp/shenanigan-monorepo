import { PrefixedHexString, Transaction } from 'ethereumjs-tx';
export declare const KEYSTORE_FILENAME = "keystore";
export declare class KeyManager {
    private readonly hdkey;
    private _privateKeys;
    private nonces;
    /**
     * @param count - # of addresses managed by this manager
     * @param workdir - read seed from keystore file (or generate one and write it)
     * @param seed - if working in memory (no workdir), you can specify a seed - or use randomly generated one.
     */
    constructor(count: number, workdir?: string, seed?: string);
    generateKeys(count: number): void;
    getAddress(index: number): PrefixedHexString;
    getAddresses(): PrefixedHexString[];
    isSigner(signer: string): boolean;
    signTransaction(signer: string, tx: Transaction): PrefixedHexString;
}
