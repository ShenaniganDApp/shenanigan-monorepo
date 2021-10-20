import React, { ReactElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../UI';

type Props = {
    setFooterHeight: (n: number) => void;
    commentsVisible: boolean;
    setCommentsVisible: (b: boolean) => void;
    detailsVisible: boolean;
    setDetailsVisible: (b: boolean) => void;
    supportVisible: boolean;
    setSupportVisible: (b: boolean) => void;
};

export const DashboardButtons = ({
    setFooterHeight,
    commentsVisible,
    setCommentsVisible,
    detailsVisible,
    setDetailsVisible,
    supportVisible,
    setSupportVisible
}: Props): ReactElement => {
    const gray = 'rgba(250, 250, 250, 0.75)';
    const { bottom } = useSafeAreaInsets();

    return (
        <View
            style={[styles.footer, { bottom }]}
            onLayout={(event) =>
                setFooterHeight(event.nativeEvent.layout.height)
            }
        >
            <View style={styles.iconContainer}>
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => setCommentsVisible(!commentsVisible)}
                >
                    <Icon
                        name="message"
                        size={40}
                        color={commentsVisible ? colors.altWhite : gray}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity
                    onPress={() => setSupportVisible(!supportVisible)}
                >
                    <Icon
                        name="arrow-up-down-bold"
                        size={40}
                        color={supportVisible ? colors.altWhite : gray}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity
                    onPress={() => setDetailsVisible(!detailsVisible)}
                >
                    <Icon
                        name="format-list-bulleted"
                        size={40}
                        color={detailsVisible ? colors.altWhite : gray}
                        style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: '3%',
        position: 'absolute',
        alignSelf: 'center'
    },
    iconContainer: {
        paddingHorizontal: 12
    },
    icon: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2
    }
});
