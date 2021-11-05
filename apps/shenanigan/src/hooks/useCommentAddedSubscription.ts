import React, { useMemo } from 'react';

import { useSubscription } from 'relay-hooks';

import { GraphQLSubscriptionConfig } from 'relay-runtime';

import {
    CommentAdded,
    updater
} from '../components/comment/subscriptions/CommentAddedSubscription';
import {
    CommentAddedSubscription,
    CommentAddedSubscriptionResponse
} from '../components/comment/subscriptions/__generated__/CommentAddedSubscription.graphql';

export const useCommentAddedSubscription = () => {
    const commentAddedConfig = useMemo<
        GraphQLSubscriptionConfig<CommentAddedSubscription>
    >(
        () => ({
            subscription: CommentAdded,
            variables: {
                input: {}
            },
            onCompleted: (...args) => {
                // eslint-disable-next-line
                console.log('onCompleted: ', args);
            },
            onError: (...args) => {
                // eslint-disable-next-line
                console.log('onError: ', args);
            },
            updater
        }),
        []
    );
    useSubscription(commentAddedConfig);
};
