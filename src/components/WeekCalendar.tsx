import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { FloatingButton, Text, View } from 'react-native-ui-lib';
import { Event } from '../Model';
import { dayLetters, HourToString } from './Util';

const hourHeight = 70;
const hours = [...Array(24).keys()];

export default function WeekCalendar(props: any) {
    const {navigation, getDayEvents, onEventCreate, week, curTime, ...others}:
        {navigation: any, getDayEvents: (n: number) => Event[],
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

    return (
        <View>
            <View style={{flexDirection: 'row', height: 50}}>
                <DayHeader day='' date='' />
                {dayLetters.map((label, i) =>
                    <DayHeader key={i} day={label} dateNum={dates[i].getDate()} />
                )}
            </View>
            <HourDivider />
            <ScrollView>
                <View style={{flexDirection: 'row'}}>
                    <TimeColumn />
                    { dayLetters.map((label, i) =>
                        <DayColumn key={i} date={dates[i]} curTime={curTime} />) }
                </View>
            </ScrollView>
            <FloatingButton visible={true} button={button} />
        </View>
    );
}

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
                    <Text style={{height: 20, marginTop: -10, marginBottom: -10, textAlign: 'right'}}>{HourToString(hour) + ' '}</Text>
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

}

function TimeMarker(props: any) {
    return (
        <View style={{zIndex: 1, top: getTimeHeight(props.date),
            height: 1, marginTop: -1, backgroundColor: '#0000FF'}} />
    );
}

function getTimeHeight(date: Date) {
    var hours = date.getHours() + date.getMinutes() / 60;
    return hours * hourHeight;
}

const styles = StyleSheet.create({
    dayColumn: {flex: 1, borderRightWidth: 1, borderRightColor: '#888888'},
})