import * as React from 'react';
import { Component } from 'react';
import { TouchableOpacity, Text, TextInput } from 'react-native';

import CreateCommentMutation from './mutations/CreateCommentMutation';

type State = {
    content: string;
    challengeId: string;
};

class CreateComment extends Component<unknown, State> {
    static navigationOptions = {
        title: 'UserCreate'
    };

    state:State = {
        content: '',
        challengeId: '5ebc7a20a7dcce739360c2cc'
    };

    handleCreateComment = () => {
        const { content, challengeId } = this.state;

        const input = {
            content,
            challengeId
        };

        const onCompleted = () => {
            console.log('onCompletedCreateComment');
        };

        const onError = () => {
            console.log('onErrorCreateComment');
        };

        CreateCommentMutation.commit(input, onCompleted, onError);
    };

    render() {
        const { content } = this.state;
        return (
            <>
                <TextInput
                    placeholder="content"
                    value={content}
                    onChangeText={(value) => this.setState({ content: value })}
                />
                <TouchableOpacity onPress={() => this.handleCreateComment()}>
                    <Text>Create</Text>
                </TouchableOpacity>
            </>
        );
    }
}

export default CreateComment;
