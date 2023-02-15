import React, { useCallback, useMemo, useState } from 'react';
import {FloatingButton, Text, View} from 'react-native-ui-lib';
import {commStyles, mergeStateAction} from './Util';
import EditRepeatSettings from './EditRepeatSettings';
import {Event, Task, RepeatSettings} from '../Model'
import EditTask from './EditTask';
import EditEvent from './EditEvent';
import { ScrollView } from 'react-native';

export default React.memo(function ({ route, navigation, ...props }: any) {
    const {eventId} = route.params;
    const {events, onEventChange, tasks, onTaskChange, ...others}: {
        events: Record<number, Event>, onEventChange: (v: any) => void,
        tasks: Record<number, Task>, onTaskChange: (v: any) => void,
        others: any} = props;

    const event = useMemo(() => events[eventId], [events, eventId]);
    const task = useMemo(() => tasks[event.taskId], [tasks, event]);
    const [repeat, setRepeat] = useState({
        repeat: false, until: event.endTime,
        days: [true, true, true, true, true, true, true]
    });
    const handleRepeatChange = useCallback((r: any) => setRepeat(mergeStateAction(r)), []);
    const button = useMemo(() => {
        return {
            label: 'Done',
            onPress: () => navigation.goBack(),
        }}, [navigation]);

    return (
        <>
        <ScrollView {...others} style={commStyles.expand}>
            <View style={commStyles.formPage}>
                <EditTask value={task} onChange={onTaskChange} />
                <EditEvent value={event} onChange={onEventChange} />
                <Text style={commStyles.padded}>Repeat</Text>
                <EditRepeatSettings value={repeat} onChange={handleRepeatChange} />
                <View style={commStyles.padded} />
                <View style={commStyles.padded} />
                <View style={commStyles.padded} />
            </View>
        </ScrollView>
        <FloatingButton visible={true} button={button} />
        </>
    );
});
