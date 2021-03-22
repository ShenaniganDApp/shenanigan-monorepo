import React, { ReactElement } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    TouchableOpacityProps
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from './globalStyles';

const RoundButton = (props: TouchableOpacityProps): ReactElement => {
    const { small, icon, style, iconStyle } = props;

    return (
        <TouchableOpacity
            {...props}
            style={[
                styles.container,
                { ...(style && style) },
                {
                    height: small ? 40 : 50,
                    width: small ? 40 : 50,
                    borderRadius: small ? 20 : 25
                }
            ]}
            onPress={props.onPress}
        >
            <Icon
                name={icon}
                size={small ? 20 : 30}
                color="#121212"
                style={iconStyle}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(230, 255, 255, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 4,
        elevation: 3,
        borderColor: colors.yellow,
        borderWidth: 2
    }
});

export default RoundButton;
