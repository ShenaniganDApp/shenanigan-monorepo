<<<<<<< Updated upstream
import React, { useRef, useState, ReactElement} from 'react';
=======
import React, { useRef, useState, ReactElement } from 'react';
>>>>>>> Stashed changes
import { Button, PermissionsAndroid, StyleSheet, View } from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STREAM_KEY } from 'react-native-dotenv';

<<<<<<< Updated upstream
export function LiveDashboard() : ReactElement {
=======
export function LiveDashboard(): ReactElement {
>>>>>>> Stashed changes
    const styles = StyleSheet.create({
        cameraContainer: {
            aspectRatio: 9 / 16
        },
        camera: {
            width: '100%',
<<<<<<< Updated upstream
            height: '100%',
=======
            height: '100%'
>>>>>>> Stashed changes
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
                <NodeCameraView
                    style={styles.camera}
                    ref={vb}
                    outputUrl={`rtmp://fra-rtmp.livepeer.com/live/${STREAM_KEY}`}
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
        </SafeAreaView>
    );
}
