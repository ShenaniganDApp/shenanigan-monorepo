import WalletConnect from '@walletconnect/client';
import { IConnector } from '@walletconnect/types';

let connector: IConnector;

// const readContracts = useContractLoader(localProvider);

/**
 * Create a new WalletConnect connector
 *
 * @param connector
 * @param opts
 */
function createConnector(opts) {
    const connector = new WalletConnect(opts);
    return connector;
}
// Check if connection is already established

function onDisplayURI(err, payload) {
    if (err) {
        throw err;
    }
    return payload.params[0];

    throw new Error('URI missing from display_uri');
}

function onConnect(err, payload) {
    if (err) {
        throw err;
    }
    console.log('Connected', payload);
    sendPing();
}

function onSessionUpdate(err, payload) {
    if (err) {
        throw err;
    }
    console.log('Session updated', payload);
}

function onPing(err, payload) {
    if (err) {
        throw err;
    }
    console.log('Ping received', payload);
}

function sendPing() {
    connector.sendCustomRequest({ method: 'ping' });
}

function setupConnection(){
    let uri = ""
    connector = createConnector({
        bridge: 'https://bridge.walletconnect.org'
    });
    connector.on('display_uri', (err, payload) => {
        uri = onDisplayURI(err, payload);
    });
    connector.on('connect', (err, payload) => {
        onConnect(err, payload);
    });
    connector.on('session_update', (err, payload) => {
        onSessionUpdate(err, payload);
    });
    console.log('Creating session');
    connector.createSession();
    return uri;
}

export default setupConnection
