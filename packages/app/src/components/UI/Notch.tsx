import React from 'react';
import { Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Gradient from 'react-native-linear-gradient';
import { colors, sizes } from '../UI';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
    title: string;
    pink?: boolean;
    gradient?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    onPress?: () => void;
};

const Notch = ({ pink, gradient, style, textStyle, onPress, title }: Props) => {
    const pinkColor = [colors.pink, colors.pink];
    const grayColor = [colors.gray, colors.gray];
    const pinkGradient = ['#F89056', '#FB0C66'];
    const pinkLocations = [0.2, 1];
    const grayGradient = [colors.gray, '#2A2628'];
    const grayLocations = [0, 0.9];

    const gradientColors =
        pink && gradient
            ? pinkGradient
            : !pink && gradient
            ? grayGradient
            : pink && !gradient
            ? pinkColor
            : grayColor;

    const containerStyles = [
        styles.shadow,
        {
            borderBottomLeftRadius: pink ? 20 : 0,
            borderBottomRightRadius: pink ? 0 : 20
        },
        style
    ];

    const content = (
        <>
            {pink && gradient && <PinkGradientCorner />}
            {pink && !gradient && <PinkCorner />}
            <Gradient
                useAngle
                angle={90}
                colors={gradientColors}
                locations={pink ? pinkLocations : grayLocations}
                style={[
                    styles.bg,
                    {
                        paddingLeft: pink ? 4 : 12,
                        paddingRight: pink ? 12 : 4,
                        borderTopLeftRadius: pink ? 0 : 5,
                        borderBottomLeftRadius: pink ? 0 : 5,
                        borderTopRightRadius: pink ? 5 : 0,
                        borderBottomRightRadius: pink ? 5 : 0
                    }
                ]}
            >
                <Text style={[styles.text, textStyle]}>{title}</Text>
            </Gradient>
            {!pink && gradient && <GrayGradientCorner />}
            {!pink && !gradient && <GrayCorner />}
        </>
    );

    return onPress ? (
        <View>
            <TouchableOpacity
                style={containerStyles}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {content}
            </TouchableOpacity>
        </View>
    ) : (
        <View>
            <View style={containerStyles}>{content}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        elevation: 10,
        shadowOpacity: 0.25,
        shadowRadius: 10,
        borderRadius: 5,
        flexDirection: 'row',
        alignSelf: 'center'
    },
    border: {
        borderRadius: 5,
        overflow: 'hidden'
    },
    bg: {
        justifyContent: 'center'
    },
    text: {
        paddingVertical: 4,
        fontWeight: '900',
        fontFamily: 'impact',
        color: 'white',
        fontSize: sizes.smallScreen ? 16 : 20,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 5
    }
});

export default Notch;

const PinkCorner = () => (
    <Svg
        width={29}
        height={'100%'}
        preserveAspectRatio="none"
        viewBox="0 0 29 25"
        fill="none"
        style={{ marginRight: -1 }}
    >
        <Path
            d="M0 5a5 5 0 015-5h24v25H16.358a5 5 0 01-3.265-1.213L1.735 13.996A5 5 0 010 10.209V5z"
            fill="#FB0A66"
        />
    </Svg>
);
const GrayCorner = () => (
    <Svg
        width={29}
        height={'100%'}
        preserveAspectRatio="none"
        viewBox="0 0 29 25"
        fill="none"
        style={{ marginLeft: -1 }}
    >
        <Path
            d="M29 5a5 5 0 00-5-5H0v25h12.642a5 5 0 003.265-1.213l11.358-9.791A5 5 0 0029 10.209V5z"
            fill="#7C6484"
        />
    </Svg>
);

const PinkGradientCorner = () => (
    <Svg
        width={29}
        height={'100%'}
        preserveAspectRatio="none"
        viewBox="0 0 29 37"
        fill="none"
        style={{ marginRight: -1 }}
    >
        <Path
            d="M0 5a5 5 0 015-5h24v37H16.934a5 5 0 01-3.935-1.916L1.065 19.858A5 5 0 010 16.774V5z"
            fill="url(#prefix__paint0_linear)"
        />
        <Defs>
            <LinearGradient
                id="prefix__paint0_linear"
                x1={0}
                y1={19}
                x2={29}
                y2={19}
                gradientUnits="userSpaceOnUse"
            >
                <Stop stopColor="#FEDAC6" />
                <Stop offset={1} stopColor="#F89056" />
            </LinearGradient>
        </Defs>
    </Svg>
);
const GrayGradientCorner = () => (
    <Svg
        width={29}
        height={'100%'}
        preserveAspectRatio="none"
        viewBox="0 0 29 37"
        fill="none"
        style={{ marginLeft: -1 }}
    >
        <Path
            d="M29 5a5 5 0 00-5-5H0v37h12.066a5 5 0 003.935-1.916l11.934-15.226A5 5 0 0029 16.774V5z"
            fill="#2A2628"
        />
    </Svg>
);
