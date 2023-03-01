import React, {useCallback} from 'react';
import { View } from 'react-native-ui-lib';
import DateAndTime from './DateAndTime';
import { commStyles } from '../Util';
import { Event } from '../Model';

export default React.memo(function(props: any) {
    const {value, onChange, ...others}:
        {value: Event, onChange: (v: any) => void} = props;
        const handleStartTimeChange = useCallback(
            (date: Date) => onChange({
                id: value.id,
                task_id: value.task_id,
                startTime: date,
                endTime: new Date(value.endTime.getTime()
                    + (date.getTime() - value.startTime.getTime())),
            }),
            [onChange, value.id, value.task_id, value.startTime, value.endTime]);
        const handleEndTimeChange = useCallback(
            (date: Date) => onChange({id: value.id, task_id: value.task_id, endTime: date}),
            [onChange, value.id, value.task_id]);
    return (
        <View style={commStyles.hBox}>
            <DateAndTime style={commStyles.expand} title='Start' value={value.startTime}
                onChange={handleStartTimeChange} />
            <View style={commStyles.padded} />
            <DateAndTime style={commStyles.expand} title='End' value={value.endTime}
                onChange={handleEndTimeChange} />
        </View>
    )
});
