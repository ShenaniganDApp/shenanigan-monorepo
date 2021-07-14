import React, {
    ReactElement,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TabNavSwipeContext, SwiperContext } from '../../contexts';
import {
    BottomSheet,
    Button,
    colors,
    Fade,
    Gradient,
    ImageCard,
    Notch,
    sizes,
    Tag,
    Title,
    XdaiBanner
} from '../UI';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetType from '@gorhom/bottom-sheet';
import { BuyConfirmModal } from './BuyConfirmModal';
import { MarketListings } from './MarketListings';
import { MarketCardScreenProps as Props } from '../../Navigator';

export const MarketCardScreen = (props: Props): ReactElement => {
    const { setSwipeEnabled } = props.route.params;
    const { setMainTabsSwipe } = useContext(TabNavSwipeContext);
    const { setWalletScroll } = useContext(SwiperContext);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const sheetRef = useRef<BottomSheetType | null>(null);
    const [listingsVisible, setListingsVisible] = useState(false);
    const [animation, setAnimation] = useState(true);

    useEffect(() => setMainTabsSwipe(false), [setMainTabsSwipe]);

    useEffect(() => {
        if (listingsVisible) {
            setWalletScroll(false);
            setSwipeEnabled(false);
        } else {
            setWalletScroll(true);
            setSwipeEnabled(true);
        }
    }, [listingsVisible, setWalletScroll, setSwipeEnabled]);

    const handlePress = () => {
        setAnimation(true);
        setListingsVisible(true);
    };

    const tags = ['xDai', 'sportsball', 'other'];

    return (
        <>
            <Gradient>
                <View style={[styles.container, { paddingTop: insets.top }]}>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon
                                name="chevron-left"
                                size={52}
                                color={colors.pink}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.imageContainer}>
                        <ImageCard
                            height={sizes.smallScreen ? 200 : 300}
                            source={{
                                uri:
                                    'https://images.unsplash.com/photo-1474224017046-182ece80b263?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80'
                            }}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Title size={30} style={styles.title}>
                            Watch Me Lift 1,000 lbs
                        </Title>

                        <Title size={19} style={styles.subtitle}>
                            by YoungKidWarrior
                        </Title>

                        <Notch
                            title="I whiff completely"
                            style={{ alignSelf: 'flex-start' }}
                        />
                        <Text style={styles.body}>
                            This is a description of the card. It might be the
                            challenge description the athlete inputs, or maybe
                            it’s made when the owner puts it up for sale.
                        </Text>

                        <View style={styles.tagContainer}>
                            {tags.map((tag) => (
                                <Tag text={tag} key={tag} style={styles.tag} />
                            ))}
                        </View>

                        <Text style={styles.currentPrice}>Current Price</Text>
                        <View style={styles.availabilityContainer}>
                            <XdaiBanner
                                amount="99,999"
                                style={{ alignSelf: 'flex-start' }}
                            />
                            <Title size={19}>100/420 Available</Title>
                        </View>
                        <Button
                            title="Buy Now"
                            fullWidth
                            onPress={() => sheetRef.current?.expand()}
                        />
                        <TouchableOpacity onPress={handlePress}>
                            <Text style={styles.more}>
                                25 more available from 999,999
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Gradient>
            <BottomSheet ref={sheetRef}>
                <BuyConfirmModal />
            </BottomSheet>
            {listingsVisible && (
                <Fade
                    style={[StyleSheet.absoluteFill, { flex: 1 }]}
                    event={animation}
                    afterAnimationOut={() => setListingsVisible(false)}
                >
                    <MarketListings setAnimation={setAnimation} />
                </Fade>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '4%'
    },
    iconContainer: {
        alignSelf: 'flex-start'
    },
    icon: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 5
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: '4%'
    },
    textContainer: {
        paddingHorizontal: '4%',
        paddingVertical: '4%',
        borderColor: 'rgba(251, 250, 250, 0.7)',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    title: {
        marginBottom: 2
    },
    subtitle: {
        marginBottom: '2%'
    },
    body: {
        marginVertical: '2%'
    },
    tagContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: '2%',
        flexWrap: 'wrap'
    },
    tag: {
        marginHorizontal: '2%',
        marginBottom: '2%'
    },
    currentPrice: {
        color: colors.gray
    },
    availabilityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '4%'
    },
    more: {
        textAlign: 'center',
        marginTop: '4%',
        fontSize: 16,
        textDecorationLine: 'underline'
    }
});
