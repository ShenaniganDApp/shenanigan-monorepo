import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StubContainer from 'react-storybooks-relay-container';

import { Comment } from '../../../src/components/comment/Comment';

storiesOf('Comment', module).add('a single comment', () => {
    const commentProps = {
        _id: 'something0idasa',
        comment: {
            id: 'comment-id-1',
            content: 'Comment from StoryBook',
            creator: {
                username: 'youngkidwarrior',
                addresses: ['0x1585265df55c14ce79f44fa3a54c89852c220ffd']
            }
        }
    };

    return <StubContainer Component={Comment} props={commentProps} />;
});
