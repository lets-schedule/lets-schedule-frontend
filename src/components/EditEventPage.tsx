import React, {useCallback} from 'react';
import {Button, Checkbox, ColorPalette, Colors, DateTimePicker, RadioButton, RadioGroup, Text,
    TextField, Typography, View} from 'react-native-ui-lib';
import {commStyles} from './Util';
import CategoryPicker from './CategoryPicker';
import DateAndTime from './DateAndTime';
import EditRepeatSettings from './EditRepeatSettings';
import {Event, Task, RepeatSettings} from '../Model'

export default function EditEventPage(props: any) {
    const {event, onEventChange, task, onTaskChange, repeat, onRepeatChange, ...others}: {
        event: Event, onEventChange: (v: any) => void,
        task: Task, onTaskChange: (v: any) => void,
        repeat: RepeatSettings, onRepeatChange: (v: any) => void,
        others: any} = props;
    const handleTitleChange = useCallback((text: string) => onTaskChange({title: text}),
        [onTaskChange]);
    const handleCategoryChange = useCallback((c: number) => onTaskChange({category: c}),
        [onTaskChange]);
    const handleStartTimeChange = useCallback((date: Date) => onEventChange({startTime: date}),
        [onEventChange]);
    const handleEndTimeChange = useCallback((date: Date) => onEventChange({endTime: date}),
        [onEventChange]);
    return (
        <View {...others}>
            <Text style={Typography.text40L}>Edit Event</Text>
            <TextField title='Title' value={task.title} onChangeText={handleTitleChange} />
            <CategoryPicker value={task.category} onChange={handleCategoryChange} />
            <View style={commStyles.hBox}>
                <DateAndTime style={commStyles.expand} title='Start' value={event.startTime}
                    onChange={handleStartTimeChange} />
                <DateAndTime style={commStyles.expand} title='End' value={event.endTime}
                    onChange={handleEndTimeChange} />
            </View>
            <Text>Repeat</Text>
            <EditRepeatSettings value={repeat} onChange={onRepeatChange} />
            <View style={commStyles.expand} />
            <Button label='Done' />
        </View>
    );
}
