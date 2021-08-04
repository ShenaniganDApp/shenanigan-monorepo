import React, { ReactElement, useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LiveChatList } from '../comment/LiveChatList';
import { Card, colors, Title, XdaiBanner } from '../UI';

type Props = {};

/*
pointer events for messages when opacity 0
icon color when opacity 0 
*/

export const DashboardOverlay = ({ commentsQuery }: Props): ReactElement => {
    const [commentsVisible, setCommentsVisible] = useState(false);
    const [footerHeight, setFooterHeight] = useState(0);
    const commentsOpacity = useSharedValue(0);
    const supportOpacity = useSharedValue(0);
    const detailsOpacity = useSharedValue(0);

    const commentsStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(commentsOpacity.value, {
                duration: 300
            })
        };
    });

    const supportStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(supportOpacity.value, {
                duration: 300
            })
        };
    });

    const detailsStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(detailsOpacity.value, {
                duration: 300
            })
        };
    });

    useEffect(() => {
        commentsOpacity.value = commentsVisible ? 1 : 0;
    }, [commentsVisible]);

    return (
        <View style={styles.container}>
            <View style={[styles.header, styles.padding]}>
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

                <Animated.View
                    style={[
                        supportStyle,
                        {
                            flexBasis: '35%'
                        }
                    ]}
                >
                    <Card
                        glass
                        noPadding
                        style={{
                            flexGrow: 1
                        }}
                    >
                        <View style={styles.cardInner}>
                            <Title size={24} style={styles.cardTitle}>
                                Support
                            </Title>
                            <View
                                style={{
                                    flex: 1,
                                    flexDirection: 'row'
                                }}
                            >
                                <View>
                                    <LinearGradient
                                        colors={[colors.pink, colors.gray]}
                                        style={styles.supportBar}
                                    />
                                    <Icon
                                        name="triangle"
                                        size={24}
                                        color={colors.altWhite}
                                        style={styles.barIcon}
                                    />
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'space-between',
                                        marginLeft: '6%'
                                    }}
                                >
                                    <View>
                                        <Title
                                            size={34}
                                            style={styles.supportTitle}
                                        >
                                            200
                                            <Text style={{ fontSize: 19 }}>
                                                /
                                            </Text>
                                        </Title>
                                        <Title
                                            size={19}
                                            style={styles.supportTitle}
                                        >
                                            500
                                        </Title>
                                    </View>

                                    <View>
                                        <Title
                                            size={34}
                                            style={styles.supportTitle}
                                        >
                                            300
                                            <Text style={{ fontSize: 19 }}>
                                                /
                                            </Text>
                                        </Title>
                                        <Title
                                            size={19}
                                            style={styles.supportTitle}
                                        >
                                            500
                                        </Title>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                <Animated.View
                    style={[
                        detailsStyle,
                        {
                            flexBasis: '35%'
                        }
                    ]}
                >
                    <Card
                        glass
                        noPadding
                        style={{
                            flexGrow: 1
                        }}
                    >
                        <View style={styles.cardInner}>
                            <Title size={24} style={styles.cardTitle}>
                                Details
                            </Title>
                            <Text>Viewers:</Text>
                            <Text style={styles.cardBody}>160</Text>
                            <Text>Time:</Text>
                            <Text style={styles.cardBody}>1:08:04</Text>
                            <Text>Remaining:</Text>
                            <Text style={styles.cardBody}>1:08:04</Text>
                            <Text style={{ marginBottom: 4 }}>Donations:</Text>
                            <XdaiBanner amount={420} />
                        </View>
                    </Card>
                </Animated.View>
            </View>

            <View>
                <Animated.View
                    style={commentsStyle}
                    pointerEvents={commentsVisible ? 'auto' : 'none'}
                >
                    <LinearGradient
                        colors={['#00000000', '#000000a4']}
                        style={[
                            styles.padding,
                            {
                                overflow: 'visible',
                                paddingBottom: footerHeight
                            }
                        ]}
                    >
                        <LiveChatList query={commentsQuery} />
                    </LinearGradient>
                </Animated.View>

                <View
                    style={styles.footer}
                    onLayout={(event) =>
                        setFooterHeight(event.nativeEvent.layout.height)
                    }
                >
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() => setCommentsVisible(!commentsVisible)}
                    >
                        <Icon
                            name="message"
                            size={40}
                            color={
                                commentsVisible
                                    ? colors.altWhite
                                    : 'rgba(250, 250, 250, 0.75)'
                            }
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() =>
                            supportOpacity.value === 0
                                ? (supportOpacity.value = 1)
                                : (supportOpacity.value = 0)
                        }
                    >
                        <Icon
                            name="format-list-bulleted"
                            size={40}
                            color={colors.altWhite}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={() =>
                            detailsOpacity.value === 0
                                ? (detailsOpacity.value = 1)
                                : (detailsOpacity.value = 0)
                        }
                    >
                        <Icon
                            name="arrow-up-down-bold"
                            size={40}
                            color={colors.altWhite}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    padding: {
        paddingHorizontal: '4%'
    },
    flex: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        marginTop: '4%'
    },
    card: {},
    cardInner: {
        paddingHorizontal: '10%',
        paddingVertical: '12%',
        flexGrow: 1
    },
    cardTitle: {
        color: 'black',
        marginBottom: 12,
        textAlign: 'center'
    },
    cardBody: {
        fontWeight: '900',
        marginBottom: 10
    },
    supportTitle: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2
    },
    supportBar: {
        width: 20,
        flex: 1,
        borderRadius: 5,
        marginLeft: 5
    },
    barIcon: {
        position: 'absolute',
        transform: [{ rotate: '90deg' }, { translateX: -12 }],
        left: -8,
        top: '33%',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 3, height: 0 },
        textShadowRadius: 5
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: '3%',

        position: 'absolute',
        bottom: 0,
        alignSelf: 'center'
    },
    iconContainer: {
        marginHorizontal: 12
    },
    icon: {
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2
    }
});
