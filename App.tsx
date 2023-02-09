import React, { useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import EditFixedEventPage from './src/components/EditFixedEventPage';
import TaskList from './src/components/TaskList';
import { Task } from './src/Model';

function mergeState(prevState: any, update: any) {
    const merged = { ...prevState, ...update };
    console.log(merged);
    return merged;
}

function mergeStateAction(update: any) {
    return (prevState: any) => mergeState(prevState, update);
}

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const [event, setEvent] = useState({ id: 0, taskId: 0, startTime: new Date(), endTime: new Date() });
    const [task, setTask] = useState({ title: 'cool event', category: 0, priority: 2 });
    const [repeat, setRepeat] = useState({ repeat: true, until: new Date(), days: [true, false, false, true, true, true, false] });
    const [constraint, setConstraint] = useState({ id: 0, dueTime: new Date(), duration: 5000 * 60 * 60 });
    const [tasksList, setTasksList] = useState([
        { id: 0, title: 'cool event', category: 0, priority: 2, createdTime: new Date() },
        { id: 1, title: 'event 2', category: 0, priority: 2, createdTime: new Date() },
        { id: 2, title: 'event 3', category: 0, priority: 2, createdTime: new Date() },
        { id: 3, title: 'event 4', category: 0, priority: 2, createdTime: new Date() },
        { id: 4, title: 'event 5', category: 0, priority: 2, createdTime: new Date() },
        { id: 5, title: 'event 6', category: 0, priority: 2, createdTime: new Date() },
    ]);

    const handleEventChange = useCallback((e: any) => setEvent(mergeStateAction(e)), []);
    const handleTaskChange = useCallback((t: any) => setTask(mergeStateAction(t)), []);
    const handleRepeatChange = useCallback((r: any) => setRepeat(mergeStateAction(r)), []);
    const handleConstraintChange = useCallback((c: any) => setConstraint(mergeStateAction(c)), []);
    const handleTaskDelete = useCallback((item: Task) => {
        setTasksList(tasksList.filter(t => t.id !== item.id));
    }, [tasksList]);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="TaskList" options={{title: 'Tasks'}}>
                    {(props) => <TaskList {...props}
                        tasks={tasksList} onTaskDelete={handleTaskDelete} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default gestureHandlerRootHOC(App);
