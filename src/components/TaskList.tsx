import React, {useCallback, useMemo} from 'react';
import { FlatList } from 'react-native';
import { Colors, Drawer, FloatingButton, ListItem, Text, View } from 'react-native-ui-lib';
import { Task } from '../Model';
import { commStyles } from './Util';

export default function TaskList(props: any) {
    const {tasks, onTaskCreate, onTaskChange, onTaskDelete, ...others} = props;

    const renderTask = useCallback(({item, index} : {item: Task, index: number}) => (
        <Drawer leftItem={{text: 'Delete', background: Colors.red30,
                onPress: () => {onTaskDelete(item)}}}>
            <ListItem style={{backgroundColor: Colors.white}}>
                <Text>{item.title}</Text>
            </ListItem>
        </Drawer>
    ), [onTaskChange, onTaskDelete]);
    const button = useMemo(() => {
        return {
            label: 'Add Task',
            onPress: onTaskCreate,
        }}, [onTaskCreate]);

    return (
        <View style={commStyles.expand}>
            <FlatList data={tasks} renderItem={renderTask} keyExtractor={taskKeyExtractor} />
            <FloatingButton
                visible={true}
                button={button}
            />
        </View>
    );
}

function taskKeyExtractor(task: Task, index: number) {
    return task.id.toString();
}
