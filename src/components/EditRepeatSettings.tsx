import React from 'react';
import {Checkbox, RadioGroup, RadioButton, View} from 'react-native-ui-lib';
import DateAndTime from './DateAndTime';
import {RepeatSettings} from '../Model';

export default function EditRepeatSettings(props: any) {
    const {value, onChange, ...others}:
        {value: RepeatSettings, onChange: (v: RepeatSettings) => void} = props;
    return (
        <View {...others} style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
                <RadioGroup initialValue={value.repeat} onValueChange={(v: boolean) =>
                        onChange({...value, repeat: v})}>
                    <RadioButton value={false} label='Once' />
                    <RadioButton value={true} label='Weekly' />
                </RadioGroup>
                <View style={{flexDirection: 'row'}}>
                    {value.repeat && ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, i) =>
                        <VerticalCheckbox key={i} label={label} value={value.days[i]}
                            onValueChange={(v: boolean) => {
                                const newDays = value.days.slice();
                                newDays[i] = v;
                                onChange({...value, days: newDays})}} />
                    )}
                </View>
            </View>
            <View style={{flex: 1}}>
                {value.repeat &&
                    <DateAndTime style={{flex: 1}} title='Until' value={value.until}
                        onChange={(date: Date) => onChange({...value, until: date})}/>
                }
            </View>
        </View>
    );
}

function VerticalCheckbox(props: any) {
    return (
        <Checkbox {...props}
            containerStyle={{flexDirection: 'column'}} labelStyle={{marginLeft: 0}} />
    )
}