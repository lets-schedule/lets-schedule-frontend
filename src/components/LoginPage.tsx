import React, { useMemo, useState } from 'react';
import { FloatingButton, TextField, View, Text } from 'react-native-ui-lib';
import { Button, Alert } from 'react-native'
import { commStyles } from '../Util';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';

export default function LoginPage({ navigation, onSignInButtonPress, ...props }: any) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleCaptureEmail = (text:string) => {
        setEmail(text);
    };

    const handleCapturePassword = (text:string) => {
        setPassword(text);
    };

    const log_in_button = useMemo(() => {
        return {
            label: 'Log In',
            onPress: () => {
                onSignInButtonPress(email, password);
                navigation.navigate("MainTabs");
            }
        }
    }, [onSignInButtonPress, navigation, email, password]);

    if (!useIsFocused())
        return <></>
    return (
        <View style={commStyles.formPage}>
            <View style={commStyles.expand} />
            <MaterialCommunityIcons style={{alignSelf: 'center'}} name='account-circle' size={100} />
            <View style={commStyles.signIn} />
            <Button title="Create Account" onPress={() => navigation.navigate("SignUp")} />
            <View style={commStyles.padded} />
            <TextField placeholder='email' onChangeText={handleCaptureEmail} />
            <TextField secureTextEntry placeholder='password' onChangeText={handleCapturePassword}/>
            <View style={commStyles.expand} />
            <FloatingButton visible={true} button={log_in_button} />
        </View>
    )
}
