import React, { ReactElement, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { Button, colors } from '../UI';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {};

export const ImageUpload = ({
    image,
    setImage,
    removeImage,
    index,
    setIndex,
    isDefaultImage,
    setIsDefaultImage
}: Props): ReactElement => {
    const uploadGallery = () => {
        ImagePicker.openPicker({
            width: 200,
            height: 300,
            cropping: true
        })
            .then((image) => {
                setImage(image.path);
                setIsDefaultImage(false);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const chooseCamera = () => {
        ImagePicker.openCamera({
            width: 200,
            height: 300,
            cropping: true
        })
            .then((image) => {
                setImage(image.path);
                setIsDefaultImage(false);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: image }}
                        height={300}
                        width={200}
                        style={styles.image}
                    />
                    {!isDefaultImage && (
                        <TouchableOpacity
                            style={styles.close}
                            onPress={removeImage}
                        >
                            <Icon
                                name="close-circle"
                                size={30}
                                color={colors.pink}
                                style={{ marginRight: -1 }}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <View>
                    <Button
                        title="Upload from Gallery"
                        onPress={uploadGallery}
                        style={styles.uploadButton}
                    />
                    <Button title="Take with Camera" onPress={chooseCamera} />
                </View>
            </View>

            <View style={styles.pageButtons}>
                <Button onPress={() => setIndex(--index)} title="Back" small />
                <Button onPress={() => setIndex(++index)} title="Next" small />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    imageContainer: {
        alignSelf: 'center',
        marginVertical: 48,
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
        height: 300,
        width: 200,
        borderRadius: 6
    },
    close: {
        position: 'absolute',
        top: -15,
        right: -15,
        height: 34,
        width: 34,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 17,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 7,
        elevation: 3
    },
    uploadButton: {
        marginBottom: 16
    },
    pageButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
