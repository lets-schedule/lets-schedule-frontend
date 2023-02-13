import React, {useCallback} from 'react';
import { View } from 'react-native-ui-lib';
import DateAndTime from './DateAndTime';
import { commStyles } from './Util';
import { Event } from '../Model';

export default React.memo(function(props: any) {
    const {value, onChange, ...others}:
        {value: Event, onChange: (v: any) => void} = props;
        const handleStartTimeChange = useCallback(
            (date: Date) => onChange({id: value.id, startTime: date}),
            [onChange, value.id]);
        const handleEndTimeChange = useCallback(
            (date: Date) => onChange({id: value.id, endTime: date}),
            [onChange, value.id]);
    return (
        <View style={commStyles.hBox}>
            <DateAndTime style={commStyles.expand} title='Start' value={value.startTime}
                onChange={handleStartTimeChange} />
            <DateAndTime style={commStyles.expand} title='End' value={value.endTime}
                onChange={handleEndTimeChange} />
        </View>
    )
});
