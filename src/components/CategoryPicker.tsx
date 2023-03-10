import React, {useCallback} from 'react';
import { ScrollView } from 'react-native';
import {View, ColorPalette, Colors, Text} from 'react-native-ui-lib';
import {commStyles} from '../Util';

export const categoryColors =
    [Colors.red30, Colors.yellow30, Colors.green30, Colors.purple30, Colors.grey30];

export default React.memo(function(props: any) {
    const {value, onChange, ...others} = props;
    const handleValueChange = useCallback((value: string, options: any) => onChange(options.index),
        [onChange]);
    return (
        <View {...others} style={commStyles.hBox}>
            <Text style={commStyles.padded}>Category:</Text>
            <ColorPalette style={{backgroundColor: '#f2f2f2'}} colors={categoryColors}
                value={categoryColors[value]} onValueChange={handleValueChange} />
        </View>
    );
});
