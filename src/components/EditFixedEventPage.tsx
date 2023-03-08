import React, { useCallback, useMemo, useState } from 'react';
import {FloatingButton, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import {commStyles, mergeStateAction} from '../Util';
import EditRepeatSettings from './EditRepeatSettings';
import {Event, Task, RepeatSettings} from '../Model'
import EditTask from './EditTask';
import EditEvent from './EditEvent';
import { ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default React.memo(function ({ route, navigation, ...props }: any) {
    const {eventId} = route.params;
    const {events, onEventChange, onEventDelete, tasks, onTaskChange, onComplete, ...others}: {
        events: Record<number, Event>, onEventChange: (v: any) => void,
        onEventDelete: (e: Event) => void,
        tasks: Record<number, Task>, onTaskChange: (v: any) => void,
        onComplete: (eventId: number) => void,
        others: any} = props;

    const event = useMemo(() => events[eventId], [events, eventId]);
    const task = useMemo(() => tasks[event.task_id], [tasks, event]);
    
    const handleDelete = useCallback(() => {
        onEventDelete(event);
        navigation.goBack();
    }, [event, onEventDelete, navigation]);
    React.useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleDelete}>
                    <MaterialCommunityIcons name='trash-can-outline' size={32}
                        color='#222222' />
                </TouchableOpacity>
            )
        });
    }, [handleDelete]);

    const [repeat, setRepeat] = useState({
        repeat: false, until: event.endTime,
        days: [true, true, true, true, true, true, true]
    });
    const handleRepeatChange = useCallback((r: any) => setRepeat(mergeStateAction(r)), []);
    const button = useMemo(() => {
        return {
            label: 'Done',
            onPress: () => {navigation.goBack(); onComplete(eventId)},
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
        <FloatingButton visible={true} button={button} hideBackgroundOverlay={true} />
        </>
    );
});
