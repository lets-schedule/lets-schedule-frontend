import React from 'react';
import {Button, Text, View} from 'react-native-ui-lib';
import {commStyles} from './Util';
import EditRepeatSettings from './EditRepeatSettings';
import {Event, Task, RepeatSettings} from '../Model'
import EditTask from './EditTask';
import EditEvent from './EditEvent';

export default function EditFixedEventPage(props: any) {
    const {event, onEventChange, task, onTaskChange, repeat, onRepeatChange, ...others}: {
        event: Event, onEventChange: (v: any) => void,
        task: Task, onTaskChange: (v: any) => void,
        repeat: RepeatSettings, onRepeatChange: (v: any) => void,
        others: any} = props;
    return (
        <View {...others}>
            <EditTask value={task} onChange={onTaskChange} />
            <EditEvent value={event} onChange={onEventChange} />
            <Text>Repeat</Text>
            <EditRepeatSettings value={repeat} onChange={onRepeatChange} />
            <View style={commStyles.expand} />
            <Button label='Done' />
        </View>
    );
}
