import { storiesOf, Story, Meta } from '@storybook/react-native';
// import {  } from '@storybook/react/types-6-0';
// import {  } from '@storybook/addon-docs/blocks';
import React from 'react';

import { RelayStorybook } from '../../../storybook/relay/RelayStorybook';
import { Comment } from './Comment';
import { Props as CommentProps } from './Comment';

export default {
    title: 'Comment',
    component: Comment
} as Meta;

const Template: Story<CommentProps> = (args) => {
    const { mockResolvers } = args;
    console.log('mock ' + mockResolvers);
    return (
        <RelayStorybook mockResolvers={mockResolvers}>
            <Comment {...args} />
        </RelayStorybook>
    );
};

export const Simple = Template.bind({});
Simple.args = {
    mockResolvers: {
        Comment: () => ({
            _id: '_id',
            comment: {
                id: 'storybook#id',
                content: 'storybook#content',
                creator: {
                    username: 'storybook#username',
                    addresses: ['storybook#addresses']
                }
            }
        })
    }
};

// storiesOf('Comment', module).add('a single comment', () => {
//     const commentProps = {
//         _id: 'something0idasa',
//         comment: {
//             id: 'comment-id-1',
//             content: 'Comment from StoryBook',
//             creator: {
//                 username: 'youngkidwarrior',
//                 addresses: ['0x1585265df55c14ce79f44fa3a54c89852c220ffd']
//             }
//         }
//     };

//     return  Component={Comment} props={commentProps} />;
// });
