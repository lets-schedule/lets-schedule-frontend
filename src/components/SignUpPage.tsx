import React, { useState, useMemo } from 'react';
import { FloatingButton, TextField, View } from 'react-native-ui-lib';
import { Alert } from 'react-native';
import { commStyles } from '../Util';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';

export default function SignUpPage({ navigation, onSignUpButtonPress, ...props }: any) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const sign_up_button = useMemo(() => {
        return {
            label: 'Create Account',
            onPress: () => {
                onSignUpButtonPress(email, password, navigation);
            }
        }
    }, [onSignUpButtonPress, navigation, email, password]);

    if (!useIsFocused())
        return <></>
    return (
        <View style={commStyles.formPage}>
            <View style={commStyles.expand} />
            <MaterialCommunityIcons style={{alignSelf: 'center'}} name='account-circle' size={100} />
            <View style={commStyles.padded} />
            <TextField id="signup_email" placeholder='email' onChangeText={setEmail} />
            <TextField id="signup_password" secureTextEntry placeholder='password' onChangeText={setPassword} />
            <View style={commStyles.expand} />
            <FloatingButton visible={true} button={sign_up_button}/>
        </View>
    )
}
