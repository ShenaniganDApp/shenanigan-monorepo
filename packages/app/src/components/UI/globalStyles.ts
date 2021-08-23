import { Dimensions } from 'react-native';

export const colors = {
    pink: '#FB0A66',
    yellow: '#ff4',
    green: '#007A00',
    blue: '#08affa',
    orange: '#FB7429',
    altWhite: '#E6FFFF',
    gray: '#7C6484',
    grayMedium: '#5E5063',
    grayDark: '#2A2628'
};

export const backgroundStyles = {
    basic: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderColor: 'rgba(251, 250, 250, 0.7)',
        borderWidth: 1
    },
    fullSheet: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderColor: 'rgba(251, 250, 250, 0.7)',
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flex: 1
    }
};

export const sizes = {
    windowW: Dimensions.get('window').width,
    windowH: Dimensions.get('window').height,
    smallScreen: Dimensions.get('window').width < 400,
    containerPadding:
        Dimensions.get('window').width < 400
            ? Dimensions.get('window').width * 0.02
            : 16
};
