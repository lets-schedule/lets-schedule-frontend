import React, { useState, useCallback, useMemo } from 'react';
import { LogBox, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import TaskList from './src/components/TaskList';
import { Event, Constraint, Task } from './src/Model';
import { mergeState, randomId, startOfHour } from './src/Util';
import EditAutoTaskPage from './src/components/EditAutoTaskPage';
import WeekCalendar from './src/components/WeekCalendar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditFixedEventPage from './src/components/EditFixedEventPage';
import { removeTaskEvents, scheduleTaskEvents } from './src/AutoSchedule';
import LoginPage from './src/components/LoginPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

LogBox.ignoreAllLogs();

function App(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

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
            category: 0,
            priority: 2,
            createdTime: new Date()
        };
        const startTime = startOfHour(new Date(new Date().getTime() + 1000 * 60 * 60));
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
            category: 2,
            priority: 2,
            createdTime: new Date(),
        };
        const newConstraint: Constraint = {
            taskId: newTask.id,
            dueTime: startOfHour(new Date(new Date().getTime() + 1000 * 60 * 60)),
            duration: 1000 * 60 * 60,
        };
        setTasks({...tasks, [newTask.id]: newTask});
        setConstraints({...constraints, [newConstraint.taskId]: newConstraint});
        return newTask.id;
    }, [tasks, constraints]);
    const handleTaskDelete = useCallback((item: Task) => {
        setTasks((({[item.id]: _, ...rest}) => rest)(tasks));
        setEvents(removeTaskEvents(item.id, events));
    }, [tasks, events]);
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

    const curTime = useMemo(() => new Date(), []); // TODO update time!!

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
                {(props) => <WeekCalendar {...props} onEventCreate={handleEventCreate}
                    week={curWeek} curTime={curTime} getDayEvents={getDayEvents} tasks={tasks} />}
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
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginPage}
                    options={{title: "Let's Schedule"}} />
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
