import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { Title } from '../UI';

type Props = {};

export const DashboardToggle = (props: Props): ReactElement => {
    return (
        <View
            style={[
                {
                    flexBasis: '24%'
                }
            ]}
        >
            <Title size={19} shadow>
                Live
            </Title>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {}
});
