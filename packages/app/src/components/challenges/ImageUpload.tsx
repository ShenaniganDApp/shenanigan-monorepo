import React, { ReactElement, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import ImagePicker, {
    Image as ImageProps
} from 'react-native-image-crop-picker';
import { Button, colors, sizes, Title } from '../UI';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FormType } from './CreateChallengeScreen';

type Props = {
    form: FormType;
    setForm: (fn: any) => void;
};

export const ImageUpload = ({ form, setForm }: Props): ReactElement => {
    const [modalVisible, setModalVisible] = useState(false);
    const imageHeight = sizes.windowH * 0.33;
    const imageWidth = (imageHeight * 9) / 16;

    const setImage = (image: ImageProps) => {
        setModalVisible(false);
        const base64 = `data:${image.mime};base64,${image.data}`;
        setForm((prevState: FormType) => ({
            ...prevState,
            image: base64
        }));
    };

    const uploadGallery = () => {
        ImagePicker.openPicker({
            width: imageWidth,
            height: imageHeight,
            cropping: true,
            includeBase64: true
        }).then((image) => setImage(image));
    };

    const chooseCamera = () => {
        ImagePicker.openCamera({
            width: 200,
            height: 300,
            cropping: true,
            includeBase64: true
        }).then((image) => setImage(image));
    };

    const removeImage = () => {
        setForm((prevState: FormType) => ({
            ...prevState,
            image: ''
        }));
    };

    return (
        <View>
            <View style={styles.imageContainer}>
                {form.image ? (
                    <View>
                        <Image
                            source={{ uri: form.image }}
                            height={imageHeight}
                            width={imageWidth}
                            style={[
                                styles.image,
                                { height: imageHeight, width: imageWidth }
                            ]}
                        />
                        <TouchableOpacity
                            onPress={removeImage}
                            style={styles.closeIconContainer}
                        >
                            <Icon
                                name="close-thick"
                                size={36}
                                color={colors.pink}
                                style={styles.closeIcon}
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[
                            styles.card,
                            { height: imageHeight, width: imageWidth }
                        ]}
                        onPress={() => setModalVisible(true)}
                    >
                        <CornerBorders />
                        <View style={styles.cardInner}>
                            <Icon
                                name="plus-thick"
                                size={72}
                                color={'rgba(124, 100, 132, 0.75)'}
                                style={styles.plusIcon}
                            />
                            <Title size={24} style={styles.uploadTitle}>
                                Upload an Image
                            </Title>
                        </View>
                    </TouchableOpacity>
                )}
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modal}>
                    <Button
                        title="Upload from Gallery"
                        onPress={uploadGallery}
                        style={styles.margin}
                    />
                    <Button
                        title="Take with Camera"
                        onPress={chooseCamera}
                        style={styles.margin}
                    />
                    <Button
                        title="Cancel"
                        onPress={() => setModalVisible(false)}
                        color="gray"
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        marginTop: '4%'
    },
    closeIconContainer: {
        position: 'absolute',
        top: -15,
        right: -15
    },
    closeIcon: {
        textShadowColor: 'rgba(0,0,0,.3)',
        textShadowOffset: {
            width: 0,
            height: 3
        },
        textShadowRadius: 5
    },
    image: {
        borderRadius: 10
    },
    card: {
        backgroundColor: colors.altWhite,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2%'
    },
    cardInner: {
        alignItems: 'center'
    },
    uploadTitle: {
        color: 'rgba(124, 100, 132, 0.75)',
        textAlign: 'center'
    },
    plusIcon: {
        lineHeight: 62
    },
    margin: {
        marginBottom: '4%'
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,.8)'
    },
    corner: {
        borderTopColor: 'rgba(124, 100, 132, 0.75)',
        borderLeftColor: 'rgba(124, 100, 132, 0.75)',
        borderTopWidth: 2,
        borderLeftWidth: 2,
        height: 20,
        width: 20,
        borderTopLeftRadius: 10,
        position: 'absolute'
    }
});

const CornerBorders = () => (
    <>
        <View
            style={[
                styles.corner,
                {
                    top: 10,
                    left: 10
                }
            ]}
        />
        <View
            style={[
                styles.corner,
                {
                    top: 10,
                    right: 10,
                    transform: [
                        {
                            rotate: '90deg'
                        }
                    ]
                }
            ]}
        />
        <View
            style={[
                styles.corner,
                {
                    bottom: 10,
                    right: 10,
                    transform: [
                        {
                            rotate: '180deg'
                        }
                    ]
                }
            ]}
        />
        <View
            style={[
                styles.corner,
                {
                    bottom: 10,
                    left: 10,
                    transform: [
                        {
                            rotate: '270deg'
                        }
                    ]
                }
            ]}
        />
    </>
);
