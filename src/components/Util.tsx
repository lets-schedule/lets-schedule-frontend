import {StyleSheet} from 'react-native';

export const dayLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function HourToString(hour: number) {
    var hour12 = hour % 12;
    if (hour12 == 0)
        hour12 = 12;
    return hour12 + (hour >= 12 ? ' PM' : ' AM');
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