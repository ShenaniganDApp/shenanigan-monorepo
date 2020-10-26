import { SUBSCRIPTION_URL } from 'react-native-dotenv';
import { Observable, SubscribeFunction } from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws';

export const setupSubscription: SubscribeFunction = (
    request,
    variables,
    {}
) => {
    const query = request.text;
    const connectionParams = {};
    const subscriptionClient = new SubscriptionClient(SUBSCRIPTION_URL, {
        reconnect: true,
        connectionParams
    });

    const observable = subscriptionClient.request({ query: query!, variables });

    return Observable.from(observable);
};
