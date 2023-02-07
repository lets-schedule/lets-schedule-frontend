import React from 'react';
import {Button, Checkbox, ColorPalette, Colors, DateTimePicker, RadioButton, RadioGroup, Text,
    TextField, Typography, View} from 'react-native-ui-lib';
import CategoryPicker from './CategoryPicker';
import DateAndTime from './DateAndTime';
import EditRepeatSettings from './EditRepeatSettings';
import {Event, Task, RepeatSettings} from '../Model'

export default function EditEventPage(props: any) {
    const {event, onEventChange, task, onTaskChange, repeat, onRepeatChange, ...others}: {
        event: Event, onEventChange: (v: Event) => void,
        task: Task, onTaskChange: (v: Task) => void,
        repeat: RepeatSettings, onRepeatChange: (v: RepeatSettings) => void,
        others: any} = props;
    return (
        <View {...others}>
            <Text style={Typography.text40L}>Edit Event</Text>
            <TextField title='Title' value={task.title}
                onChangeText={(text: string) => onTaskChange({...task, title: text})} />
            <CategoryPicker value={task.category}
                onChange={(c: number) => onTaskChange({...task, category: c})} />
            <View style={{flexDirection: 'row'}}>
                <DateAndTime style={{flex: 1}} title='Start' value={event.startTime}
                    onChange={(date: Date) => onEventChange({...event, startTime: date})} />
                <DateAndTime style={{flex: 1}} title='End' value={event.endTime}
                    onChange={(date: Date) => onEventChange({...event, endTime: date})} />
            </View>
            <Text>Repeat</Text>
            <EditRepeatSettings value={repeat} onChange={onRepeatChange} />
            <View style={{flex: 1}} />
            <Button label='Done' />
        </View>
    );
}
