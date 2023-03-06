import React, { useCallback, useMemo, useState } from 'react';
import {FloatingButton, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import {commStyles, mergeStateAction} from '../Util';
import EditRepeatSettings from './EditRepeatSettings';
import {Event, Task, RepeatSettings} from '../Model'
import EditTask from './EditTask';
import EditEvent from './EditEvent';
import { ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default React.memo(function ({ route, onCreateEvent, navigation, ...props }: any) {
    const {events, onEventChange, onEventDelete, tasks, onTaskChange, ...others}: {
        events: Record<number, Event>, onEventChange: (v: any) => void,
        onEventDelete: (e: Event) => void,
        tasks: Record<number, Task>, onTaskChange: (v: any) => void,
        others: any} = props;

    let title, category, priority, startDateTime, endDateTime;

    const handleTitleChange = (text: String) => {
        title = text;
        console.log(title);
    }

    const handleCategoryChange = (v: any) => {
        category = v;
        console.log("Category: " + category);
    }

    const handlePriorityChange = (v: any) => {
        priority = v;
        console.log("Priority: " + priority);
    }

    const handleStartDateTimeChange = (v: any) => {
        startDateTime = v;
        console.log(startDateTime);
    }

    const handleEndDateTimeChange = (v: any) => {
        endDateTime = v;
        console.log(endDateTime);
    }

    const handleDelete = useCallback(() => {
        onEventDelete();
        navigation.goBack();
    }, [onEventDelete, navigation]);

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
        repeat: false, 
        days: [true, true, true, true, true, true, true]
    });

    const handleRepeatChange = useCallback((r: any) => setRepeat(mergeStateAction(r)), []);

    const button = useMemo(() => {
        return {
            label: 'Done',
            onPress: () => {
                onCreateEvent(title, category, priority, startDateTime, endDateTime);
                navigation.goBack();
            },
        }}, [navigation]);

    return (
        <>
        <ScrollView {...others} style={commStyles.expand}>
            <View style={commStyles.formPage}>
                <EditTask onTitleChange={handleTitleChange}
                    onCategoryChange={handleCategoryChange}
                    onPriorityChange={handlePriorityChange}/>
                <EditEvent onStartDateTimeChange={handleStartDateTimeChange}
                    onEndDateTimeChange={handleEndDateTimeChange}/>
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
