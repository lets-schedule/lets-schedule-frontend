import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { FloatingButton, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { Event, Task } from '../Model';
import { categoryColors } from './CategoryPicker';
import { commStyles, dayLetters, hourToString } from '../Util';

const hourHeight = 70;
const hours = [...Array(24).keys()];

export default React.memo(function(props: any) {
    const {navigation, getDayEvents, tasks, onEventCreate, week, curTime, ...others}:
        {navigation: any, getDayEvents: (date: Date) => Event[], tasks: Record<number, Task>,
            onEventCreate: () => number, week: Date, curTime: Date} = props;

    const button = useMemo(() => {
        return {
            label: 'Add Event',
            onPress: () => {
                const eventId = onEventCreate();
                navigation.navigate("EditFixedEvent", { eventId: eventId });
            }
        }}, []);
    const dates: Date[] = useMemo(() =>
        [...Array(7)].map((e, i) => {
            var date = new Date(week);
            date.setDate(date.getDate() + i);
            return date;
        }), [week]);
    const dayEvents: Event[][] = useMemo(() =>
        dates.map((date, i) => getDayEvents(date)), [dates, getDayEvents]);

    if (!useIsFocused())
        return <></>
    return (
        <View style={commStyles.expand} >
            <View style={{flexDirection: 'row', height: 50}}>
                <DayHeader day='' date='' />
                {dayLetters.map((label, i) =>
                    <DayHeader key={i} day={label} dateNum={dates[i].getDate()} />
                )}
            </View>
            <HourDivider />
            <ScrollView style={commStyles.expand} contentOffset={{x: 0, y: 9 * hourHeight}}>
                <View style={{flexDirection: 'row'}}>
                    <TimeColumn />
                    { dayLetters.map((label, i) =>
                        <DayColumn key={i} date={dates[i]} curTime={curTime}
                            events={dayEvents[i]} tasks={tasks} navigation={navigation} />) }
                </View>
            </ScrollView>
            <FloatingButton visible={true} button={button} />
        </View>
    );
});

function DayHeader(props: any) {
    return (
        <View style={styles.dayColumn}>
            <Text style={{textAlign: 'center'}}>{props.day}</Text>
            <Text style={{textAlgin: 'center'}}>{props.dateNum}</Text>
        </View>
    )
}

function DayColumn(props: any) {
    return (
        <View style={styles.dayColumn}>
            <HourSpace />
            {props.curTime.getDate() == props.date.getDate() ?
                <TimeMarker date={new Date()} /> : <></> }
            {props.events.map((event: Event, i: number) =>
                <WeekEvent event={event} task={props.tasks[event.taskId]}
                navigation={props.navigation} />)}
            {hours.map((hour, i) =>
                <>
                    <HourDivider />
                    <HourSpace />
                </>
            )}
        </View>
    );
}

function TimeColumn(props: any) {
    return (
        <View style={styles.dayColumn}>
            <HourSpace />
            {hours.map((hour, i) =>
                <>
                    <Text style={{height: 20, marginTop: -10, marginBottom: -10, textAlign: 'right'}}>{hourToString(hour) + ' '}</Text>
                    <HourSpace />
                </>
            )}
        </View>
    )
}

function HourDivider(props: any) {
    return (
        <View style={{height: 1, marginTop: -1, backgroundColor: '#888888'}} />
    )
}

function HourSpace(props: any) {
    return (
        <View style={{height: hourHeight}} />
    )
}

function WeekEvent(props: any) {
    const {event, task, navigation} : {event: Event, task: Task, navigation: any} = props;
    const height = useMemo(() =>
        getTimeHeight(event.endTime.getTime() - event.startTime.getTime()), []);
    const onPress = useCallback(() =>
        navigation.navigate("EditFixedEvent", { eventId: event.id }), [event]);
    return (
        <TouchableOpacity style={{zIndex: 1, top: getTimeOffset(event.startTime),
            height: height, marginBottom: -height, backgroundColor: categoryColors[task.category]}}
            onPress={onPress}>
            <Text>{task.title}</Text>
        </TouchableOpacity>
    )
}

function TimeMarker(props: any) {
    return (
        <View style={{zIndex: 2, top: getTimeOffset(props.date),
            height: 2, marginTop: -1, marginBottom: -1, backgroundColor: '#0000FF'}} />
    );
}

function getTimeOffset(date: Date) {
    var hours = date.getHours() + date.getMinutes() / 60;
    return hours * hourHeight;
}

function getTimeHeight(diff: number) {
    return diff / (1000 * 60 * 60) * hourHeight;
}

const styles = StyleSheet.create({
    dayColumn: {flex: 1, borderRightWidth: 1, borderRightColor: '#888888'},
})