import React, { useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import TaskList from './src/components/TaskList';
import { Constraint, Task } from './src/Model';
import EditAutoTaskPage from './src/components/EditAutoTaskPage';

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
    const [repeat, setRepeat] = useState({ repeat: true, until: new Date(), days: [true, false, false, true, true, true, false] });
    const [tasks, setTasks] = useState({
        0: { id: 0, title: 'cool event', category: 0, priority: 2, createdTime: new Date() },
        1: { id: 1, title: 'event 2', category: 0, priority: 2, createdTime: new Date() },
    });
    const [constraints, setConstraints] = useState({
        0: {taskId: 0, dueTime: new Date(), duration: 1000 * 60 * 60 * 5},
        1: {taskId: 1, dueTime: new Date(), duration: 1000 * 60 * 60},
    });

    const handleEventChange = useCallback((e: any) => setEvent(mergeStateAction(e)), []);
    const handleRepeatChange = useCallback((r: any) => setRepeat(mergeStateAction(r)), []);
    const handleTaskCreate = useCallback(() => {
        const newTask: Task = {
            id: Math.floor(Math.random() * 1073741824), // 2 ^ 30
            title: 'New Task',
            category: 0,
            priority: 2,
            createdTime: new Date()
        };
        const newConstraint: Constraint = {
            taskId: newTask.id,
            dueTime: new Date(),
            duration: 1000 * 60 * 60,
        };
        setTasks({...tasks, [newTask.id]: newTask});
        setConstraints({...constraints, [newConstraint.taskId]: newConstraint});
    }, [tasks, constraints]);
    const handleTaskDelete = useCallback((item: Task) => {
        setTasks((({[item.id]: _, ...rest}) => rest)(tasks));
    }, [tasks]);
    const handleTaskChange = useCallback((t: any) =>
        setTasks({...tasks, [t.id]: mergeState(tasks[t.id], t)}), [tasks]);
    const handleConstraintChange = useCallback((c: any) =>
        setConstraints({...constraints, [c.taskId]: mergeState(constraints[c.taskId], c)}), [constraints]);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="TaskList">
                <Stack.Screen name="TaskList" options={{title: 'Tasks'}}>
                    {(props) => <TaskList {...props} tasks={tasks}
                        onTaskCreate={handleTaskCreate} onTaskDelete={handleTaskDelete} />}
                </Stack.Screen>
                <Stack.Screen name="EditAutoTask" options={{title: 'Edit Task'}}>
                    {(props) => <EditAutoTaskPage {...props}
                        tasks={tasks} constraints={constraints} onTaskChange={handleTaskChange}
                        onConstraintChange={handleConstraintChange} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default gestureHandlerRootHOC(App);
