import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { FloatingButton, Text, View } from 'react-native-ui-lib';
import { Event } from '../Model';
import { dayLetters, HourToString } from './Util';

const hourHeight = 70;
const hours = [...Array(24).keys()];

export default function WeekCalendar(props: any) {
    const {getDayEvents, ...others}:
        {getDayEvents: (n: number) => Event[]} = props;

    const button = useMemo(() => {
        return {
            label: 'Add Event',
            // onPress: onEventCreate,
        }}, []);

    return (
        <View style={{backgroundColor: '#EEEEEE'}}>
            <View style={{flexDirection: 'row', height: 30}}>
                <DayHeader title='' />
                {dayLetters.map((label, i) =>
                    <DayHeader key={i} title={label} />
                )}
            </View>
            <HourDivider />
            <ScrollView>
                <View style={{flexDirection: 'row'}}>
                    <TimeColumn />
                    {dayLetters.map((label, i) =>
                        <DayColumn key={i} />
                    )}
                </View>
            </ScrollView>
            <FloatingButton visible={true} button={button} />
        </View>
    );
}

function DayHeader(props: any) {
    return (
        <View style={styles.dayColumn}>
            <Text style={{textAlign: 'center'}}>{props.title}</Text>
        </View>
    )
}

function DayColumn(props: any) {
    return (
        <View style={styles.dayColumn}>
            <HourSpace />
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

const styles = StyleSheet.create({
    dayColumn: {flex: 1, borderRightWidth: 1, borderRightColor: '#000000'},
})