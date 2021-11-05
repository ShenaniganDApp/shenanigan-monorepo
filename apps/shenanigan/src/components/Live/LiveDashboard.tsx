import React, { useRef, useState, ReactElement } from 'react';
import { Button, PermissionsAndroid, StyleSheet, View } from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STREAM_KEY } from 'react-native-dotenv';

export function LiveDashboard(): ReactElement {
    const styles = StyleSheet.create({
        cameraContainer: {
            aspectRatio: 9 / 16
        },
        camera: {
            width: '100%',
            height: '100%'
        }
    });

    const [isPublish, setIsPublish] = useState(false);
    const [publishBtnTitle, setPublishBtnTitle] = useState('Start Publish');

    const vb = useRef<any>(null);

    async function requestCameraPermission() {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            ]);
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <SafeAreaView style={{ backgroundColor: '#d2ffff' }}>
            <View style={styles.cameraContainer}>
                <Button
                    title="request permissions"
                    onPress={requestCameraPermission}
                />
                <Button
                    onPress={() => {
                        if (isPublish) {
                            setPublishBtnTitle('Start Publish');
                            setIsPublish(false);

                            vb.current.stop();
                        } else {
                            setPublishBtnTitle('Stop Publish');
                            setIsPublish(true);

                            vb.current.start();
                        }
                    }}
                    title={publishBtnTitle}
                    color="#841584"
                />
                <NodeCameraView
                    style={styles.camera}
                    ref={vb}
                    outputUrl={`rtmp://mdw-rtmp.livepeer.com/live/${STREAM_KEY}`}
                    camera={{ cameraId: 1, cameraFrontMirror: true }}
                    audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
                    video={{
                        preset: 12,
                        bitrate: 400000,
                        profile: 1,
                        fps: 30,
                        videoFrontMirror: false
                    }}
                    autopreview
                />
            </View>
        </SafeAreaView>
    );
}
