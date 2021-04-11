import React, { ReactElement } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    TouchableOpacityProps,
    TextStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from './globalStyles';

type Props = TouchableOpacityProps & {
    small?: boolean;
    icon: string;
    iconStyle?: TextStyle;
};

const RoundButton = ({
    small,
    icon,
    style,
    iconStyle,
    ...rest
}: Props): ReactElement => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    height: small ? 40 : 50,
                    width: small ? 40 : 50,
                    borderRadius: small ? 20 : 25
                },
                style
            ]}
            {...rest}
        >
            <Icon
                name={icon}
                size={small ? 24 : 38}
                color="white"
                style={[styles.icon, iconStyle]}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.pink,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: 10,
        elevation: 3
    },
    icon: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 5
    }
});

export default RoundButton;
