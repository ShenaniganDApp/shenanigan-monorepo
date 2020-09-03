import { Address, IntString } from './Aliases';
export interface RelayInfoUrl {
    relayUrl: string;
}
export interface RelayRegisteredEventInfo extends RelayInfoUrl {
    relayManager: Address;
    baseRelayFee: IntString;
    pctRelayFee: IntString;
}
export declare function isInfoFromEvent(info: RelayInfoUrl): boolean;
