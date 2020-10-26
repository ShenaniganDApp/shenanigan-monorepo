import React, { useRef, useState } from 'react';
import {
    Alert,
    Button,
    Linking,
    PermissionsAndroid,
    Text,
    View
} from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {};

export default function LiveDashboard(props: Props) {
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
        <SafeAreaView style={{ flex: 1, backgroundColor: '#d2ffff' }}>
            <NodeCameraView
                style={{ height: 400 }}
                ref={vb}
                outputUrl="/"
                camera={{ cameraId: 1, cameraFrontMirror: true }}
                audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
                video={{
                    preset: 12,
                    bitrate: 400000,
                    profile: 1,
                    fps: 60,
                    videoFrontMirror: false
                }}
                autopreview
            />

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
