"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cloneRelayRequest(relayRequest) {
    return {
        request: Object.assign({}, relayRequest.request),
        relayData: Object.assign({}, relayRequest.relayData)
    };
}
exports.cloneRelayRequest = cloneRelayRequest;
//# sourceMappingURL=RelayRequest.js.map