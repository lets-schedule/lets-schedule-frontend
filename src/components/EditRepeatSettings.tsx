import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Checkbox, RadioGroup, RadioButton, View} from 'react-native-ui-lib';
import {commStyles, dayLetters} from '../Util';
import DateAndTime from './DateAndTime';
import {RepeatSettings} from '../Model';

export default React.memo(function(props: any) {
    const {value, onChange, ...others}:
        {value: RepeatSettings, onChange: (v: any) => void} = props;
    const handleRepeatChange = useCallback((v: boolean) => onChange({repeat: v}),
        [onChange]);
    const handleDayChanges = Array.from(new Array(7), (x, i) => useCallback((v: boolean) => {
        const newDays = value.days.slice();
        newDays[i] = v;
        onChange({days: newDays});
    }, [value.days, onChange]));
    const handleUntilChange = useCallback((date: Date) => onChange({until: date}),
        [onChange]);
    return (
        <View {...others} style={commStyles.hBox}>
            <View style={commStyles.expand}>
                <RadioGroup initialValue={value.repeat} onValueChange={handleRepeatChange}>
                    <RadioButton value={false} label='Once' />
                    <RadioButton value={true} label='Weekly' />
                </RadioGroup>
                <View style={commStyles.padded} />
                <View style={commStyles.hBox}>
                    {value.repeat && dayLetters.map((label, i) =>
                        <VerticalCheckbox key={i} label={label} value={value.days[i]}
                            onValueChange={handleDayChanges[i]} />
                    )}
                </View>
            </View>
            <View style={commStyles.expand}>
                {value.repeat &&
                    <DateAndTime style={commStyles.expand} title='Until' value={value.until}
                        onChange={handleUntilChange}/>
                }
            </View>
        </View>
    );
});

function VerticalCheckbox(props: any) {
    return (
        <Checkbox {...props}
            containerStyle={commStyles.vBox} labelStyle={styles.vertCheckLabel} />
    )
}

const styles = StyleSheet.create({
    vertCheckLabel: {marginLeft: 0},
})