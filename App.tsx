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
import { TouchableOpacity } from 'react-native-ui-lib';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const serverUrl = "http://10.0.2.2:3000/";

const curDate = new Date(); // TODO: update time!!

const authToken = '';

LogBox.ignoreAllLogs();
const oldWarn = console.warn;
console.warn = (...args) => {
  if (args[0].startsWith('RNUILib TextField component will soon be replaced'))
    return; // I don't care
  oldWarn(...args);
};

function fetchBackend(method: string, path: string, bodyObj: object): Promise<Response> {
  return fetch(serverUrl + path, {
    method: method,
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyObj),
  });
}

function App(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const [events, setEvents] = useState({});
    const [tasks, setTasks] = useState({});
    const [constraints, setConstraints] = useState({});

    const curWeek = useMemo(() => {
        let date = new Date(curDate);
        date.setDate(date.getDate() - date.getDay());
        return date;
    }, [])

    const handleEventCreate = useCallback(async () => {
        const newTask: Task = {
            id: -1,
            title: 'New Event',
            category: 0,
            priority: 2,
        };
        const startTime = startOfHour(new Date(curDate.getTime() + 1000 * 60 * 60));
        const endTime = new Date(startTime.getTime() + 1000 * 60 * 60);
        const newEvent: Event = {
            id: -1,
            task_id: -1,
            startTime: startTime,
            endTime: endTime,
        };

        const newTaskResponse = await fetchBackend('POST', 'task', newTask);
        const newTaskData = await newTaskResponse.json();
        console.log('Create task response: ' + JSON.stringify(newTaskData));
        newTask.id = newEvent.task_id = newTaskData.id;
        setTasks({ ...tasks, [newTask.id]: newTask });

        const newEventResponse = await fetchBackend('POST', `task/${newTask.id}/event`, newEvent);
        const newEventData = await newEventResponse.json();
        console.log('Create event response: ' + JSON.stringify(newEventData));
        newEvent.id = newEventData.id;
        setEvents({ ...events, [newEvent.id]: newEvent });

        return newEvent.id;
    }, [events])

    const handleEventChange = useCallback((e: any) => {
        setEvents({...events, [e.id]: mergeState(events[e.id], e)});
        fetchBackend('PATCH', `task/${e.task_id}/event/${e.id}`, e)
          .then((response) => response.text())
          .then((text) => console.log('Patch event response: ' + text));
    }, [events]);

    const handleTaskCreate = useCallback(async () => {
        const newTask: Task = {
            id: -1,
            title: 'New Task',
            category: 2,
            priority: 2,
        };
        const newConstraint: Constraint = {
            task_id: -1,
            dueTime: startOfHour(new Date(curDate.getTime() + 1000 * 60 * 60)),
            duration: 1000 * 60 * 60,
        };
        const newTaskResponse = await fetchBackend('POST', 'task', newTask);
        const newTaskData = await newTaskResponse.json();
        console.log('Create task response: ' + JSON.stringify(newTaskData));
        newTask.id = newConstraint.task_id = newTaskData.id;
        setTasks({...tasks, [newTask.id]: newTask});
        setConstraints({...constraints, [newConstraint.task_id]: newConstraint});
        fetchBackend('POST', `task/${newTask.id}/constraint`, newConstraint)
          .then((response) => response.text())
          .then((text) => console.log('Create constraint response: ' + text));
        return newTask.id;
    }, [tasks, constraints]);

    const handleTaskDelete = useCallback((item: Task) => {
        setTasks((({[item.id]: _, ...rest}: any) => rest)(tasks));
        setConstraints((({[item.id]: _, ...rest}: any) => rest)(constraints))
        setEvents(removeTaskEvents(item.id, events));
        fetchBackend('DELETE', `task/${item.id}`, {})
          .then((response) => response.text())
          .then((text) => console.log('Delete task response: ' + text));
    }, [tasks, events]);

    const handleTaskChange = useCallback((t: any) => {
        setTasks({...tasks, [t.id]: mergeState(tasks[t.id], t)});
        fetchBackend('PATCH', `task/${t.id}`, t)
          .then((response) => response.text())
          .then((text) => console.log('Patch task response: ' + text));
    }, [tasks]);

    const handleConstraintChange = useCallback((c: any) => {
        setConstraints({...constraints, [c.task_id]: mergeState(constraints[c.task_id], c)});
        fetchBackend('PATCH', `task/${c.task_id}/constraint`, c)
          .then((response) => response.text())
          .then((text) => console.log('Patch constraint response: ' + text));
    }, [constraints]);

    const getDayEvents = useCallback((date: Date) =>
        Object.values(events).filter((value: Event) =>
            value.startTime.getDate() == date.getDate()
            && value.startTime.getMonth() == date.getMonth()
            && value.startTime.getFullYear() == date.getFullYear()), [events]);

    const handleAutoSchedule = useCallback((task_id: number) => {
        const newEvents = removeTaskEvents(task_id, events);
        // TODO: REST API
        setEvents(scheduleTaskEvents(task_id, constraints[task_id], newEvents, curDate));
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
                {(props) => <WeekCalendar {...props} onEventCreate={handleEventCreate}
                    week={curWeek} curTime={curDate} getDayEvents={getDayEvents} tasks={tasks} />}
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
                <Stack.Screen name="EditFixedEvent" options={{
                        title: 'Edit Event',
                        headerRight: () => (
                            <TouchableOpacity>
                                <MaterialCommunityIcons name='trash-can-outline' size={32}
                                    color='#222222' />
                            </TouchableOpacity>
                        )}}>
                    {(props) => <EditFixedEventPage {...props}
                        events={events} onEventChange={handleEventChange}
                        tasks={tasks} onTaskChange={handleTaskChange} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default gestureHandlerRootHOC(App);
