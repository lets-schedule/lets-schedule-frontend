import React from 'react';
import {DateTimePicker, View} from 'react-native-ui-lib';

export default React.memo(function(props: any) {
    const {title, value, onChange, ...others} = props;

    return (
        <View {...others}>
            <DateTimePicker title={title} placeholder='Date' mode='date'
                value={value} onChange={onChange} />
            <DateTimePicker placeholder='Time' mode='time'
                value={value} onChange={onChange} />
        </View>
    )
});
