"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isInfoFromEvent(info) {
    return 'relayManager' in info && 'baseRelayFee' in info && 'pctRelayFee' in info;
}
exports.isInfoFromEvent = isInfoFromEvent;
//# sourceMappingURL=RelayRegisteredEventInfo.js.map