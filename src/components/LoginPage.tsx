import React, { useMemo } from 'react';
import { FloatingButton, TextField, View, Text } from 'react-native-ui-lib';
import { Button, Alert } from 'react-native'
import { commStyles } from '../Util';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';

export default function LoginPage({ 
    navigation, onSignInButtonPress, ...props }: any) {

    let user_email;
    let password;

    const handleCaptureEmail = (text:string) => {
        user_email = text;
        //console.log(user_email);
    };

    const handleCapturePassword = (text:string) => {
        password = text;
    };

    const log_in_button = useMemo(() => {
        return {
            label: 'Log In',
            onPress: () => {
                onSignInButtonPress(user_email, password);
                navigation.navigate("MainTabs");
            }
        }
    }, []);

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
