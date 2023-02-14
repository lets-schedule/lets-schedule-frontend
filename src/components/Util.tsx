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
});
