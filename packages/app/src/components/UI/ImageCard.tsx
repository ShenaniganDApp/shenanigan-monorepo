import React, { ReactElement } from 'react';
import {
    View,
    StyleSheet,
    Image,
    ImageProps,
    ViewStyle,
    ImageStyle
} from 'react-native';

type Props = ImageProps & {
    height?: number;
    wrapperStyle?: ViewStyle;
    style?: ImageStyle;
};

const ImageCard = ({
    height,
    wrapperStyle,
    style,
    ...rest
}: Props): ReactElement => {
    return (
        <View style={[styles.container, wrapperStyle]}>
            <Image
                style={[styles.image, style]}
                height={height ? height : 300}
                width={height ? (height / 3) * 2 : 200}
                resizeMode="cover"
                {...rest}
            />
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
        elevation: 3
    },
    image: {
        backgroundColor: '#444',
        borderRadius: 5
    }
});
