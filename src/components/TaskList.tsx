import { useIsFocused } from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Colors, Drawer, FloatingButton, ListItem, Text, View } from 'react-native-ui-lib';
import { Constraint, Task } from '../Model';
import { commStyles } from '../Util';

export default React.memo(function(props: any) {
    const {navigation, tasks, constraints, onTaskCreate, onTaskDelete, ...others}:
        {navigation: any, tasks: Record<number, Task>, constraints: Record<number, Constraint>,
            onTaskCreate: () => number, onTaskDelete: (t: Task) => void} = props;

    const renderTask = useCallback(({item, index} : {item: Task, index: number}) => {
        const itemPressed = () => {
            navigation.navigate("EditAutoTask", { task_id: item.id })
        };
        return (
            <Drawer leftItem={{text: 'Delete', background: Colors.red30,
                    onPress: () => {onTaskDelete(item)}}}>
                <ListItem style={styles.taskItem} onPress={itemPressed}>
                    <Text>{item.title}</Text>
                    <View style={commStyles.grow} />
                    <Text>{'Due: '+ constraints[item.id].dueTime.toLocaleDateString()}</Text>
                </ListItem>
            </Drawer>
        )}, [onTaskDelete]);
    
    const taskList = useMemo(() => Object.values(tasks).filter((task: Task) =>
        task.id in constraints), [tasks, constraints]);

    const button = useMemo(() => {
        return {
            label: 'Add Task',
            onPress: () => {
                const task_id = onTaskCreate();
                navigation.navigate("EditAutoTask", { task_id: task_id });
            },
        }}, [onTaskCreate]);

    if (!useIsFocused())
        return <></>
    return (
        <View {...others} style={commStyles.expand}>
            { taskList.length == 0 ?
                <>
                    <View style={commStyles.padded} />
                    <Text style={commStyles.centerText}>No tasks added yet.</Text>
                </> :
                <FlatList data={taskList} renderItem={renderTask} keyExtractor={taskKeyExtractor} />
            }
            <FloatingButton
                visible={true}
                button={button}
            />
        </View>
    );
});

function taskKeyExtractor(task: Task, index: number) {
    return task.id.toString();
}

const styles = StyleSheet.create({
    taskItem: {
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
    },
});
