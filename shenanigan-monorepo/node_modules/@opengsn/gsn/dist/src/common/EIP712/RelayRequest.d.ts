import RelayData from './RelayData';
import ForwardRequest from './ForwardRequest';
export default interface RelayRequest {
    request: ForwardRequest;
    relayData: RelayData;
}
export declare function cloneRelayRequest(relayRequest: RelayRequest): RelayRequest;
