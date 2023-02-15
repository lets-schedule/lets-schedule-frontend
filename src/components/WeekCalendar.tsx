import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { FloatingButton, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Event, Task } from '../Model';
import { categoryColors } from './CategoryPicker';
import { commStyles, dayLetters, hourToString, monthNames } from '../Util';

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
        }}, [navigation]);
    const dates: Date[] = useMemo(() =>
        [...Array(7)].map((e, i) => {
            var date = new Date(week);
            date.setDate(date.getDate() + i);
            return date;
        }), [week]);
    const dayEvents: Event[][] = useMemo(() =>
        dates.map((date, i) => getDayEvents(date)), [dates, getDayEvents]);
    const scrollOffset = useMemo(() => {return {x: 0, y: 9 * hourHeight}}, []);

    if (!useIsFocused())
        return <></>
    return (
        <View style={commStyles.expand} >
            <View style={commStyles.hBox}>
                <TouchableOpacity>
                    <MaterialCommunityIcons name='arrow-left-thick' size={32} color='#222222' />
                </TouchableOpacity>
                <Text text40 style={styles.title}>{monthNames[week.getMonth()]}</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name='arrow-right-thick' size={32} color='#222222' />
                </TouchableOpacity>
            </View>
            <View style={styles.hourDivider} />
            <View style={styles.header}>
                <DayHeader day='' date='' />
                {dayLetters.map((label, i) =>
                    <DayHeader key={i} day={label} dateNum={dates[i].getDate()} />
                )}
            </View>
            <View style={styles.hourDivider} />
            <ScrollView style={commStyles.expand} contentOffset={scrollOffset}>
                <View style={commStyles.hBox}>
                    <TimeColumn />
                    { dayLetters.map((label, i) =>
                        <DayColumn key={i} date={dates[i]} curTime={curTime}
                            events={dayEvents[i]} tasks={tasks} navigation={navigation} />) }
                </View>
            </ScrollView>
            <FloatingButton visible={true} button={button} hideBackgroundOverlay={true} />
        </View>
    );
});

function DayHeader(props: any) {
    const {day, dateNum} = props;
    return (
        <View style={styles.dayColumn}>
            <Text style={styles.dayLabel}>{day}</Text>
            <Text style={styles.dayLabel}>{dateNum}</Text>
        </View>
    )
}

function DayColumn(props: any) {
    const {curTime, date, events, tasks, navigation} = props;
    return (
        <View style={styles.dayColumn}>
            <View style={styles.hourSpace} />
            { curTime.getDate() == date.getDate() ?
                <TimeMarker date={curTime} /> : <></> }
            { events.map((event: Event, i: number) =>
                <WeekEvent event={event} task={tasks[event.taskId]} navigation={navigation} />) }
            { hours.map((hour, i) =>
                <>
                    <View style={styles.hourDivider} />
                    <View style={styles.hourSpace} />
                </>
            ) }
        </View>
    );
}

function TimeColumn(props: any) {
    return (
        <View style={styles.dayColumn}>
            <View style={styles.hourSpace} />
            {hours.map((hour, i) =>
                <>
                    <Text style={styles.hourLabel}>{hourToString(hour) + ' '}</Text>
                    <View style={styles.hourSpace} />
                </>
            )}
        </View>
    )
}

function WeekEvent(props: any) {
    const {event, task, navigation} : {event: Event, task: Task, navigation: any} = props;
    const height = useMemo(() =>
        getTimeHeight(event.endTime.getTime() - event.startTime.getTime()), [event]);
    const style = useMemo(() => { return {
        zIndex: 1,
        top: getTimeOffset(event.startTime),
        height: height,
        marginBottom: -height,
        backgroundColor: categoryColors[task.category],
    }}, [event, task, height]);
    const onPress = useCallback(() =>
        navigation.navigate("EditFixedEvent", { eventId: event.id }), [event]);
    return (
        <TouchableOpacity style={style} onPress={onPress}>
            <Text>{task.title}</Text>
        </TouchableOpacity>
    )
}

function TimeMarker(props: any) {
    const {date} = props;
    const style = useMemo(() => { return {
        zIndex: 2,
        top: getTimeOffset(date),
        height: 2,
        marginTop: -1,
        marginBottom: -1,
        backgroundColor: '#0000FF',
    }}, [date])
    return <View style={style} />;
}

function getTimeOffset(date: Date) {
    var hours = date.getHours() + date.getMinutes() / 60;
    return hours * hourHeight;
}

function getTimeHeight(diff: number) {
    return diff / (1000 * 60 * 60) * hourHeight;
}

const styles = StyleSheet.create({
    title: {textAlign: 'center', paddingBottom: 10, flex: 1},
    header: {flexDirection: 'row', height: 50},
    dayColumn: {flex: 1, borderRightWidth: 1, borderRightColor: '#888888'},
    dayLabel: {textAlign: 'center'},
    hourDivider: {height: 1, marginTop: -1, backgroundColor: '#888888'},
    hourSpace: {height: hourHeight},
    hourLabel: {height: 20, marginTop: -10, marginBottom: -10, textAlign: 'right'},
})