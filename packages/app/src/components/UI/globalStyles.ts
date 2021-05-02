import { Dimensions } from 'react-native';

export const colors = {
    pink: '#FB0A66',
    yellow: '#ff4',
    green: '#007A00',
    blue: '#08affa',
    orange: '#FB7429',
    altWhite: '#E6FFFF',
    gray: '#7C6484',
    grayDark: '#2A2628'
};

export const sizes = {
    windowW: Dimensions.get('window').width,
    windowH: Dimensions.get('window').height,
    smallScreen: Dimensions.get('window').width < 400
};
