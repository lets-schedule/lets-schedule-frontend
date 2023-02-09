import React, {useCallback} from 'react';
import { FlatList } from 'react-native';
import { Colors, Drawer, ListItem, Text, View } from 'react-native-ui-lib';
import { Task } from '../Model';

export default function TaskList(props: any) {
    const {tasks, onTaskChange, onTaskDelete, ...others} = props;

    const renderTask = useCallback(({item, index} : {item: Task, index: number}) => (
        <Drawer leftItem={{text: 'Delete', background: Colors.red30,
                onPress: () => {onTaskDelete(item)}}}>
            <ListItem style={{backgroundColor: Colors.white}}>
                <Text>{item.title}</Text>
            </ListItem>
        </Drawer>
    ), [onTaskChange, onTaskDelete]);

    return (
        <FlatList data={tasks} renderItem={renderTask} keyExtractor={taskKeyExtractor} />
    );
}

function taskKeyExtractor(task: Task, index: number) {
    return task.id.toString();
}
