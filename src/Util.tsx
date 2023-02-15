import {StyleSheet} from 'react-native';

export function randomId() {
    return Math.floor(Math.random() * 1073741824); // 2 ^ 30
}

export const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
export const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function hourToString(hour: number) {
    var hour12 = hour % 12;
    if (hour12 == 0)
        hour12 = 12;
    return hour12 + (hour >= 12 ? ' PM' : ' AM');
}

export function startOfHour(date: Date) {
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

export const commStyles = StyleSheet.create({
    hBox: {flexDirection: 'row'},
    vBox: {flexDirection: 'column'},
    expand: {flex: 1},
    grow: {flexGrow: 1},
    formPage: {flex: 1, padding: 20},
    padded: {padding: 10},
});

export function mergeState(prevState: any, update: any) {
    const merged = { ...prevState, ...update };
    console.log(merged);
    return merged;
}

export function mergeStateAction(update: any) {
    return (prevState: any) => mergeState(prevState, update);
}