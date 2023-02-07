import React from 'react';
import {View, ColorPalette, Colors, Text} from 'react-native-ui-lib';

const categoryColors =
    ['#fff', Colors.red30, Colors.yellow30, Colors.green30, Colors.purple30, Colors.grey30];

export default function CategoryPicker(props: any) {
    const {value, onChange, ...others} = props;
    return (
        <View style={{flexDirection: 'row'}}>
            <Text>Category:</Text>
            <ColorPalette colors={categoryColors} value={categoryColors[value]}
                onValueChange={(value: string, options: any) => onChange(options.index)} />
        </View>
    );
}

