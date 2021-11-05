import { SUBSCRIPTION_URL } from 'react-native-dotenv';
import { Observable, SubscribeFunction } from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import AsyncStorage from '@react-native-async-storage/async-storage';

let token: any;

(async () => {
    token = await AsyncStorage.getItem('token');
})();

export const setupSubscription: SubscribeFunction = (request, variables) => {
    const query = request.text;
    const connectionParams = {};
    if (token) {
        connectionParams['authorization'] = `Bearer ${token}`;
    }
    const subscriptionClient = new SubscriptionClient(SUBSCRIPTION_URL, {
        reconnect: true,
        connectionParams
    });

    const observable = subscriptionClient.request({
        query: query!,
        operationName: request.name,
        variables
    });

    return Observable.from(observable);
};
