import React, { useState, useMemo } from 'react';
import { FloatingButton, TextField, View } from 'react-native-ui-lib';
import { Alert } from 'react-native';
import { commStyles } from '../Util';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';

export default function SignUpPage({ navigation, onSignUpButtonPress, ...props }: any) {

    let user_email;
    let password;

    const handleCaptureEmail = (text:string) => {
        user_email = text;
        //console.log(user_email);
    };

    const handleCapturePassword = (text:string) => {
        password = text;
    };

    const sign_up_button = useMemo(() => {
        return {
            label: 'Create Account',
            onPress: () => {
                onSignUpButtonPress(user_email, password, navigation);
                navigation.navigate("MainTabs");
            }
        }
    }, [onSignUpButtonPress, navigation]);

    const handleChange = (event) => {
        console.log(event.target.value);
        onEmailChange(event.target.value);
    };

    if (!useIsFocused())
        return <></>
    return (
        <View style={commStyles.formPage}>
            <View style={commStyles.expand} />
            <MaterialCommunityIcons style={{alignSelf: 'center'}} name='account-circle' size={100} />
            <View style={commStyles.padded} />
            <TextField id="signup_email" placeholder='email' onChangeText={handleCaptureEmail} />
            <TextField id="signup_password" secureTextEntry placeholder='password' onChangeText={handleCapturePassword} />
            <View style={commStyles.expand} />
            <FloatingButton visible={true} button={sign_up_button}/>
        </View>
    )
}
