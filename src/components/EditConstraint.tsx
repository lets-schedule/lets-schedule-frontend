import React, {useCallback} from 'react';
import { NumberInput, NumberInputData, View } from 'react-native-ui-lib';
import { Constraint } from '../Model';
import DateAndTime from './DateAndTime';
import { commStyles } from '../Util';

const HOUR_MILLIS = 1000 * 60 * 60;

export default React.memo(function(props: any) {

    const {onChange, ...others}:
        {onChange: (v: any) => void} = props;

    const handleDurationChange = useCallback((data: NumberInputData) => {
        if (data.type === 'valid')
            onChange({duration: data.number * HOUR_MILLIS});
    }, [onChange]);

    const handleDueChange = useCallback(
        (date: Date) => onChange({dueTime: date}),
        [onChange]);

    return (
        <View style={commStyles.hBox}>
            <View style={commStyles.expand}>
                <NumberInput label='Duration:' trailingText=' hours'
                    initialNumber={5}
                    onChangeNumber={handleDurationChange} />
            </View>
            <View style={commStyles.expand}>
                <DateAndTime title='Due' onChange={handleDueChange} />
            </View>
        </View>
    );
});
