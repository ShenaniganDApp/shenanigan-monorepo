import React, {
    ReactElement,
    useState,
    useEffect,
    useRef,
    useContext
} from 'react';
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    Animated,
    TouchableOpacity,
    Dimensions,
    Platform
} from 'react-native';
import { Gradient, ImageCard, Title, XdaiBanner, Notch, Button } from '../UI';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../UI/globalStyles';
import { TabNavSwipeContext } from '../../contexts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { graphql, usePaginationFragment } from 'react-relay';
import { UserChallengeDetailListProps } from '../../Navigator';

type Props = UserChallengeDetailListProps;

const { width, height } = Dimensions.get('window');

const SPACING = 10;
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;

export const UserChallengeDetailList = (props: Props): ReactElement => {
    const { data } = usePaginationFragment(
        graphql`
            fragment UserChallengeDetailList_me on User
            @argumentDefinitions(
                count: { type: "Int", defaultValue: 20 }
                cursor: { type: "String" }
            )
            @refetchable(queryName: "UserChallengesDetailListRefetchQuery") {
                createdChallenges(first: $count, after: $cursor)
                    @connection(
                        key: "UserChallengeDetailList_createdChallenges"
                    ) {
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                    edges {
                        node {
                            _id
                            content
                            title
                            active
                            createdAt
                            challengeCards {
                                edges {
                                    node {
                                        createdAt
                                        resultType
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
        props.route.params.me
    );

    const { cardIndex } = props.route.params;
    const imageHeight = height * 0.355;
    const imageWidth = (imageHeight * 2) / 3;

    const myList = useRef<FlatList>();

    const [challenges, setChallenges] = useState([]);
    const { createdChallenges } = data;
    const { edges } = createdChallenges;
    const [index, setIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const { top } = useSafeAreaInsets();

    const { setMainTabsSwipe } = useContext(TabNavSwipeContext);

    useEffect(() => {
        setChallenges([
            { key: 'empty-left' },
            ...edges,
            { key: 'empty-right' }
        ]);
    }, [edges]);

    useEffect(() => {
        if (challenges.length && myList.current) {
            myList.current.scrollToIndex({
                animated: false,
                index: cardIndex === 0 ? cardIndex : cardIndex + 1
            });
        }
    }, [edges]);

    const returnToChallengesList = () => {
        setMainTabsSwipe(true);
        props.navigation.goBack();
    };

    const onViewableItemsChanged = ({ viewableItems, changed }) => {
        // console.log('viewableItemsChanged', viewableItems)
        // console.log('changed', changed)
    };

    const onViewRef = useRef((viewableItems) => {
        console.log('viewableItems', viewableItems.changed);
        // Use viewable items in state or as intended
    });

    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 100 });

    const renderItem = ({ item, index }) => {
        const { node } = item;

        if (!node?.title) {
            return <View style={{ width: EMPTY_ITEM_SIZE }} />;
        }

        const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE
        ];

        const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: 'clamp'
        });

        return (
            <View style={styles.cardContainer}>
                <Animated.View
                    style={{
                        marginHorizontal: -4,
                        // paddingVertical: SPACING * 6,
                        paddingBottom: SPACING * 5,
                        paddingHorizontal: 23,
                        alignItems: 'center',
                        transform: [{ translateY }],
                        borderWidth: 1,
                        borderColor: 'rgba(251, 250, 250, 0.7)',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: 10
                    }}
                >
                    <View>
                        <View style={styles.imageContainer}>
                            <ImageCard
                                height={imageHeight}
                                width={imageWidth}
                                source={{
                                    uri:
                                        'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                                }}
                            />
                        </View>

                        <Title size={30} style={styles.title}>
                            {node?.title}
                        </Title>

                        <View style={styles.challengeDetails}>
                            <XdaiBanner
                                style={{
                                    marginLeft: -5,
                                    marginTop: 2,
                                    marginBottom: 10
                                }}
                                amount="17 xDAI Donated"
                            />

                            <Notch
                                title="I whiff completely"
                                style={{
                                    alignSelf: 'flex-start',
                                    marginBottom: 15
                                }}
                            />

                            <Text
                                style={{
                                    marginHorizontal: 60
                                }}
                            >
                                {node?.content}
                            </Text>

                            <Button
                                title="Activate"
                                style={{ marginVertical: 15 }}
                            />
                        </View>
                    </View>
                </Animated.View>
            </View>
        );
    };

    return (
        <>
            <Gradient>
                <View style={[styles.container, { paddingTop: top }]}>
                    <View>
                        {index === 0 && (
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={returnToChallengesList}
                            >
                                <Icon
                                    name="chevron-left"
                                    size={42}
                                    color={colors.pink}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.gridButton}
                            onPress={returnToChallengesList}
                        >
                            <Icon
                                name="view-grid-outline"
                                size={42}
                                color={colors.altWhite}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: '15%', flex: 1 }}>
                        <Animated.FlatList
                            showsHorizontalScrollIndicator={false}
                            ref={myList}
                            initialScrollIndex={0}
                            onScrollToIndexFailed={(info) => {
                                const wait = new Promise((resolve) =>
                                    setTimeout(resolve, 500)
                                );
                                wait.then(() => {
                                    myList.current?.scrollToIndex({
                                        index: info.index,
                                        animated: false
                                    });
                                });
                            }}
                            data={challenges}
                            keyExtractor={(item) => item.key}
                            horizontal
                            bounces={false}
                            decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
                            renderToHardwareTextureAndroid
                            contentContainerStyle={{ alignItems: 'center' }}
                            snapToInterval={ITEM_SIZE}
                            snapToAlignment="start"
                            onScroll={Animated.event(
                                [
                                    {
                                        nativeEvent: {
                                            contentOffset: { x: scrollX }
                                        }
                                    }
                                ],
                                { useNativeDriver: false }
                            )}
                            scrollEventThrottle={16} // so that we have this event in 60 fps
                            renderItem={renderItem}
                            onViewableItemsChanged={onViewRef.current}
                            viewabilityConfig={viewConfigRef.current}
                        />
                    </View>
                </View>
            </Gradient>
        </>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardContainer: {
        width: 331,
        height: 516
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 9
    },
    gridButton: {
        position: 'absolute',
        right: 10,
        top: 0,
        zIndex: 9
    },
    container: {
        flex: 1
        // paddingHorizontal: '4%'
    },
    title: {
        textAlign: 'center',
        marginVertical: 15
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: -100
    },
    challengeDetails: {
        borderRadius: 10,
        backgroundColor: colors.altWhite,
        width: 287,
        height: 217
    },
    icon: {
        textShadowColor: 'rgba(0,0,0,.3)',
        textShadowOffset: {
            width: 0,
            height: 3
        },
        textShadowRadius: 5
    }
});
