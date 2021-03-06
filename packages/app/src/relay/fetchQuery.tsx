import AsyncStorage from '@react-native-community/async-storage';
import { GRAPHQL_URL } from 'react-native-dotenv';
import { UploadableMap, Variables } from 'react-relay';
import { RequestNode } from 'relay-runtime';

import fetchWithRetries from './fetchWithRetries';
import { getHeaders, getRequestBody, handleData, isMutation } from './helpers';
// Define a function that fetches the results of a request (query/mutation/etc)
// and returns its results as a Promise:
const fetchQuery = async (
    request: RequestNode,
    variables: Variables,
    uploadables: UploadableMap
): Promise<any> => {
    try {
        // const token = await AsyncStorage.getItem('token');
        const token =
            'WyIweGRhNzNlYTlmN2E2NzE4ZDFkZjU4YWExNDAwNjM4ZWUzYTEzYzU0ZTJkMjU1MmZlNjM5ODc2ZGI3NTA5MGE5MDE1ODc4YWNiNDQwMjg3YTU3Y2EyOGM0ZWQwNTgwNzc2ZDBjM2ViOTU5NTQwYjc0OWZkMmRhMTNiMTc1MWUzOWE0MWMiLCJ7XCJpYXRcIjoxNjI2MjM4ODQxNjIyLFwiZXhwXCI6MTYyNjg0MzY0MTYyMixcImlzc1wiOlwiMHhiMTkzRTI3NTM0OEZlNGEzRTUzNjgyNzI4MDg2YjE0OTVDRDAyYzZEXCIsXCJhdWRcIjpcInNoZW5hbmlnYW5cIixcInRpZFwiOlwiOWMwNmY1OTMtNWE5Ny00ZDZjLWJkYWUtYTM2ZDRkYTc2YWIwXCJ9Il0=';
        const body = getRequestBody(request, variables, uploadables);
        const headers = {
            ...getHeaders(uploadables, token)
        };
        const response = await fetchWithRetries(GRAPHQL_URL, {
            method: 'POST',
            headers,
            body,
            fetchTimeout: 20000,
            retryDelays: [1000, 3000, 5000]
        });

        const data = await handleData(response);

        if (response.status === 401) {
            throw data.errors;
        }

        if (isMutation(request) && data.errors) {
            throw data;
        }

        if (!data.data) {
            throw data.errors;
        }

        return data;
    } catch (err) {
        // eslint-disable-next-line
        console.log('err: ', err);

        const timeoutRegexp = new RegExp(/Still no successful response after/);
        const serverUnavailableRegexp = new RegExp(/Failed to fetch/);
        if (
            timeoutRegexp.test(err.message) ||
            serverUnavailableRegexp.test(err.message)
        ) {
            throw new Error('Unavailable service. Try again later.');
        }

        throw err;
    }
};

export { fetchQuery };
