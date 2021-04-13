import React, { ReactElement } from 'react';
import {
    View,
    StyleSheet,
    Image,
    ImageProps,
    ViewStyle,
    ImageStyle,
    Text
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '.';

type Props = ImageProps & {
    height?: number;
    success?: boolean;
    wrapperStyle?: ViewStyle;
    style?: ImageStyle;
};

const ImageCard = ({
    height,
    wrapperStyle,
    style,
    success,
    ...rest
}: Props): ReactElement => {
    const gradientColors = success
        ? [colors.yellow, colors.pink]
        : [colors.grayDark, colors.gray];
    return (
        <View
            style={[
                styles.container,
                wrapperStyle,
                {
                    height: height ? height : 270,
                    width: height ? (height / 3) * 2 : 180
                }
            ]}
        >
            <Image
                style={[
                    styles.image,
                    style,
                    {
                        height: '100%',
                        width: '100%'
                    }
                ]}
                height={height ? height : 300}
                width={height ? (height / 3) * 2 : 200}
                resizeMode="cover"
                {...rest}
            />
            {success != null && (
                <LinearGradient
                    useAngle
                    angle={0}
                    locations={[0, 0.55]}
                    colors={gradientColors}
                    style={[styles.outcome]}
                >
                    <Text style={[styles.outcomeText]}>
                        {success ? 'Success' : 'Failure'}
                    </Text>
                </LinearGradient>
            )}
        </View>
    );
};

export default ImageCard;

const styles = StyleSheet.create({
    container: {
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: 10,
        elevation: 20,
        // elevation won't work with bgcolor
        backgroundColor: '#444',
        borderRadius: 5
    },
    image: {
        borderRadius: 5
    },
    outcome: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    },
    outcomeText: {
        fontWeight: '900',
        color: 'white',
        fontSize: 18
    }
});
