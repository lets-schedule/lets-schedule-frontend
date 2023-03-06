import React, {useCallback} from 'react';
import { NumberInput, NumberInputData, View } from 'react-native-ui-lib';
import { Constraint } from '../Model';
import DateAndTime from './DateAndTime';
import { commStyles } from '../Util';

const HOUR_MILLIS = 1000 * 60 * 60;

export default React.memo(function(props: any) {

    const {value, onChange, ...others}:
        {value: Constraint, onChange: (v: any) => void} = props;

    const handleDurationChange = useCallback((data: NumberInputData) => {
        if (data.type === 'valid')
            onChange({task_id: value.task_id, duration: data.number * HOUR_MILLIS});
    }, [onChange, value.task_id]);

    const handleDueChange = useCallback(
        (date: Date) => onChange({task_id: value.task_id, dueTime: date}),
        [onChange, value.task_id]);

    return (
        <View style={commStyles.hBox}>
            <View style={commStyles.expand}>
                <NumberInput label='Duration:' trailingText=' hours'
                    initialNumber={value.duration / HOUR_MILLIS}
                    onChangeNumber={handleDurationChange} />
            </View>
            <View style={commStyles.expand}>
                <DateAndTime title='Due' value={value.dueTime} onChange={handleDueChange} />
            </View>
        </View>
    );
});
