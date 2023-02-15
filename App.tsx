import React, { useState, useCallback, useMemo } from 'react';
import { LogBox, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import TaskList from './src/components/TaskList';
import { Event, Constraint, Task } from './src/Model';
import { mergeState, randomId } from './src/Util';
import EditAutoTaskPage from './src/components/EditAutoTaskPage';
import WeeklyCalendar from './src/components/WeekCalendar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditFixedEventPage from './src/components/EditFixedEventPage';
import { removeTaskEvents, scheduleTaskEvents } from './src/AutoSchedule';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

LogBox.ignoreAllLogs();

function App(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const hourLater = useMemo(() => {
        let date = new Date();
        date.setHours(date.getHours() + 1);
        return date;
    }, [])
    const [events, setEvents] = useState({});
    const [tasks, setTasks] = useState({});
    const [constraints, setConstraints] = useState({});

    const curWeek = useMemo(() => {
        let date = new Date();
        date.setDate(date.getDate() - date.getDay());
        return date;
    }, [])

    const handleEventCreate = useCallback(() => {
        const newTask: Task = {
            id: randomId(),
            title: 'New Event',
            category: 1,
            priority: 2,
            createdTime: new Date()
        };
        const startTime = new Date(new Date().getTime() + 1000 * 60 * 60);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        const endTime = new Date(startTime.getTime() + 1000 * 60 * 60);
        const newEvent: Event = {
            id: randomId(),
            taskId: newTask.id,
            startTime: startTime,
            endTime: endTime,
        };
        setTasks({...tasks, [newTask.id]: newTask});
        setEvents({...events, [newEvent.id]: newEvent});
        return newEvent.id;
    }, [events])
    const handleEventChange = useCallback((e: any) =>
        setEvents({...events, [e.id]: mergeState(events[e.id], e)}), [events]);
    const handleTaskCreate = useCallback(() => {
        const newTask: Task = {
            id: randomId(),
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
        return newTask.id;
    }, [tasks, constraints]);
    const handleTaskDelete = useCallback((item: Task) => {
        setTasks((({[item.id]: _, ...rest}) => rest)(tasks));
    }, [tasks]);
    const handleTaskChange = useCallback((t: any) =>
        setTasks({...tasks, [t.id]: mergeState(tasks[t.id], t)}), [tasks]);
    const handleConstraintChange = useCallback((c: any) =>
        setConstraints({...constraints, [c.taskId]: mergeState(constraints[c.taskId], c)}), [constraints]);
    
    const getDayEvents = useCallback((date: Date) =>
        Object.values(events).filter((value: Event) =>
            value.startTime.getDate() == date.getDate()
            && value.startTime.getMonth() == date.getMonth()
            && value.startTime.getFullYear() == date.getFullYear()), [events]);
    
    const handleAutoSchedule = useCallback((taskId: number) => {
        const newEvents = removeTaskEvents(taskId, events);
        setEvents(scheduleTaskEvents(taskId, constraints[taskId], newEvents, new Date()));
    }, [events, constraints]);

    const MainTabs = (props: any) => (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name={{
                    WeekCalendar: 'calendar-month',
                    TaskList: 'format-list-checks',
                    Settings: 'cog-outline',
                  }[route.name]}
                  color={color}
                  size={size}
                />
              )})}>
            <Tab.Screen name="WeekCalendar" options={{title: 'Events'}}>
                {(props) => <WeeklyCalendar {...props} onEventCreate={handleEventCreate}
                    week={curWeek} curTime={new Date()} getDayEvents={getDayEvents} tasks={tasks} />}
            </Tab.Screen>
            <Tab.Screen name="TaskList" options={{title: 'Tasks'}}>
                {(props) => <TaskList {...props} tasks={tasks} constraints={constraints}
                        onTaskCreate={handleTaskCreate} onTaskDelete={handleTaskDelete} />}
            </Tab.Screen>
            <Tab.Screen name="Settings">
                {() => null}
            </Tab.Screen>
        </Tab.Navigator>
    );

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="MainTabs">
                <Stack.Screen name="MainTabs" component={MainTabs} options={{headerShown: false}} />
                <Stack.Screen name="EditAutoTask" options={{title: 'Edit Task'}}>
                    {(props) => <EditAutoTaskPage {...props}
                        tasks={tasks} constraints={constraints} onTaskChange={handleTaskChange}
                        onConstraintChange={handleConstraintChange} onComplete={handleAutoSchedule} />}
                </Stack.Screen>
                <Stack.Screen name="EditFixedEvent" options={{title: 'Edit Event'}}>
                    {(props) => <EditFixedEventPage {...props}
                        events={events} onEventChange={handleEventChange}
                        tasks={tasks} onTaskChange={handleTaskChange} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default gestureHandlerRootHOC(App);
