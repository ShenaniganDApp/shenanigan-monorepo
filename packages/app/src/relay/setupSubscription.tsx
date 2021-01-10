import { SUBSCRIPTION_URL } from 'react-native-dotenv';
import { Observable, SubscribeFunction } from 'relay-runtime';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import AsyncStorage from '@react-native-community/async-storage';

const getToken = async ()=> {
    const token = await AsyncStorage.getItem('token');
    return token
}

export const setupSubscription: SubscribeFunction = (
    request,
    variables,
    {}
) => {
    const query = request.text;
    const connectionParams = {};
    const token = getToken()
    if (token) {
        connectionParams['authorization'] = "Bearer Î" + token;
        console.log('connectionParams: ', connectionParams);

    }
    const subscriptionClient = new SubscriptionClient(SUBSCRIPTION_URL, {
        reconnect: true,
        connectionParams
    });

    const observable = subscriptionClient.request({ query: query!, variables });

    return Observable.from(observable);
};
