import React, { useMemo } from 'react';
import { FloatingButton, TextField, View } from 'react-native-ui-lib';
import { commStyles } from '../Util';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';

export default function LoginPage({ navigation, ...props }: any) {
    const button = useMemo(() => {
        return {
            label: 'Log In',
            onPress: () => navigation.navigate("MainTabs"),
        }}, []);

    if (!useIsFocused())
        return <></>
    return (
        <View style={commStyles.formPage}>
            <View style={commStyles.expand} />
            <MaterialCommunityIcons style={{alignSelf: 'center'}} name='account-circle' size={100} />
            <View style={commStyles.padded} />
            <TextField placeholder='username' />
            <TextField secureTextEntry placeholder='password' />
            <View style={commStyles.expand} />
            <FloatingButton visible={true} button={button} />
        </View>
    )
}