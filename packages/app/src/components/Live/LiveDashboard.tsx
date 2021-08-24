import React, { useRef, useState, ReactElement } from 'react';
import { Button, PermissionsAndroid, StyleSheet, View,  Text, TouchableOpacity, } from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STREAM_KEY } from 'react-native-dotenv';
import { RNCamera } from 'react-native-camera';
import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';
import RNFetchBlob from 'react-native-fetch-blob'

export function LiveDashboard(): ReactElement {
    const styles = StyleSheet.create({
        cameraContainer: {
            aspectRatio: 9 / 16
        },
        preview: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
          },
        capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
        },

    });
    const [isPublish, setIsPublish] = useState(true);

    const recordText = isPublish ? 'Start Publish': 'Stop Publish';
    return (
      <View style={styles.cameraContainer}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onRecordingStart={async ({nativeEvent}) => {
            let data = "";
              await new Promise(async (resolve, reject) => {
                const stream = await RNFetchBlob.fs.readStream(
                  nativeEvent,
                  "base64"
                );
                stream.onEnd(() => resolve(data));
                stream.onError(reject);
                stream.onData(chunk => data += chunk); // Append the data
                stream.open(); // Start consuming
              })
            }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          {({ camera }) => {
            return (
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={async () => {
                    if (isPublish) {
                        setIsPublish(false)
                        const options = { quality: 0.5, base64: true };
                        const data = await camera.recordAsync(options);

                    }
                    else {
                        setIsPublish(true)
                        camera.stopRecording();

                    }
                }} style={styles.capture}>
                  <Text style={{ fontSize: 14 }}> { recordText } </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera>
    </View>
  );

}
