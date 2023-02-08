import React, {useCallback} from 'react';
import {Button, Text, Typography, View} from 'react-native-ui-lib';
import {commStyles} from './Util';
import DateAndTime from './DateAndTime';
import EditRepeatSettings from './EditRepeatSettings';
import {Event, Task, RepeatSettings} from '../Model'
import EditTask from './EditTask';

export default function EditEventPage(props: any) {
    const {event, onEventChange, task, onTaskChange, repeat, onRepeatChange, ...others}: {
        event: Event, onEventChange: (v: any) => void,
        task: Task, onTaskChange: (v: any) => void,
        repeat: RepeatSettings, onRepeatChange: (v: any) => void,
        others: any} = props;
    const handleStartTimeChange = useCallback((date: Date) => onEventChange({startTime: date}),
        [onEventChange]);
    const handleEndTimeChange = useCallback((date: Date) => onEventChange({endTime: date}),
        [onEventChange]);
    return (
        <View {...others}>
            <Text style={Typography.text40L}>Edit Event</Text>
            <EditTask value={task} onChange={onTaskChange} />
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
