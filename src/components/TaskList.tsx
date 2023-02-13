import React, {useCallback, useMemo} from 'react';
import { FlatList } from 'react-native';
import { Colors, Drawer, FloatingButton, ListItem, Text, View } from 'react-native-ui-lib';
import { Task } from '../Model';
import { commStyles } from './Util';

export default React.memo(function(props: any) {
    const {navigation, tasks, onTaskCreate, onTaskDelete, ...others}:
        {navigation: any, tasks: Record<number, Task>,
            onTaskCreate: () => void, onTaskDelete: (t: Task) => void} = props;

    const renderTask = useCallback(({item, index} : {item: Task, index: number}) => {
        const itemPressed = () => {
            navigation.navigate("EditAutoTask", { taskId: item.id })
        };
        return (
            <Drawer leftItem={{text: 'Delete', background: Colors.red30,
                    onPress: () => {onTaskDelete(item)}}}>
                <ListItem style={{backgroundColor: Colors.white}} onPress={itemPressed}>
                    <Text>{item.title}</Text>
                </ListItem>
            </Drawer>
        )}, [onTaskDelete]);

    const button = useMemo(() => {
        return {
            label: 'Add Task',
            onPress: onTaskCreate,
        }}, [onTaskCreate]);

    return (
        <View {...others} style={commStyles.expand}>
            <FlatList data={Object.values(tasks)} renderItem={renderTask} keyExtractor={taskKeyExtractor} />
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
