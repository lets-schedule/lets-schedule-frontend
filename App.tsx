import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { LogBox, useColorScheme, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
import SignUpPage from './src/components/SignUpPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const serverURL = "http://52.12.169.220:3000/";

const curDate = new Date(); // TODO: update time!!

const authToken = '';
const refresh_token = '';
const resource_owner = '';
const user_email = '';

type Authorization = {
    authToken: string;
    refreshToken: string;
    userEmail: string;
}

LogBox.ignoreAllLogs();
const oldWarn = console.warn;
console.warn = (...args) => {
  if (args[0].startsWith('RNUILib TextField component will soon be replaced'))
    return; // I don't care
  oldWarn(...args);
};



function App(): JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const [events, setEvents]: [Record<number, Event>, Function] = useState({});
    const [tasks, setTasks]: [Record<number, Task>, Function] = useState({});
    const [constraints, setConstraints]: [Record<number, Constraint>, Function] = useState({});
    const [email, setEmail]: [String, Function] = useState({});
    const [auth, setAuth]: [Authorization, Function] = useState<Authorization>({ 
    authToken: "", refreshToken: "", userEmail: ""});

    async function storeData(value: String) {
        try {
            await AsyncStorage.setItem('@storage_Key', value);
        } catch (e) {
            console.warn(e);
        }
    }

    async function getData(): Promise<Response> {
        try {
            const value = await AsyncStorage.getItem('@storage_Key');
            if (value !== null) {
                return value;
            } else {
                console.warn("value is null");
            }
        } catch (e) {
            console.warn(e);
        }
    }

    async function fetchBackend(method: string, path: string, bodyObj: object): Promise<Response> {
        const authToken = await getData();
        route = serverURL + path;
        console.log("method: " + method);
        console.log("object to be sent: " + JSON.stringify(bodyObj));
        console.log("route: " + route);

        if (typeof authToken !== "string") {
            console.warn("Authtoken not valid");
            return;
        }

          return fetch(route, {
            method: method,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer ' + authToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyObj),
          });
    }

    const curWeek = useMemo(() => {
        let date = new Date(curDate);
        date.setDate(date.getDate() - date.getDay());
        return date;
    }, [])

    const handleEventCreate = useCallback(async (
            title: String, priority: Integer, category: Integer, startDateTime: any, endDateTime: any) => {


        const newTask: Task = {
            title: title,
            priority: priority,
            category: category
        }

        const newEvent: Event = {
            startTime: startDateTime,
            endTime: endDateTime
        }

        try {
            const newTaskResponse = await fetchBackend('POST', 'task', newTask);
            try {
                const newTaskData = await newTaskResponse.json();
                console.log('Create task response: ' + JSON.stringify(newTaskData));
                newTask.id = newTaskData.id;
                setTasks({ ...tasks, [newTask.id]: newTask });
                try {
                    const newEventResponse = await fetchBackend('POST', `task/${newTask.id}/event`, newEvent);
                    try {
                        const newEventData = await newEventResponse.json();
                        console.log('Create event response: ' + JSON.stringify(newEventData));
                        newEvent.id = newEventData.id;
                        newEvent.task_id = newTask.id;
                    } catch (errors) {
                        console.warn(errors);
                    }
                } catch (errors) {
                    console.warn(errors)
                }
            } catch (errors) {
                console.warn(errors);
            }

            setEvents({ ...events, [newEvent.id]: newEvent });

        } catch (errors) {
            console.log(errors);
        }



        return newEvent.id;
    }, [events])

    const handleEventDelete = useCallback((e: Event) => {
        setEvents((({[e.id]: _, ...rest}: any) => rest)(events));
        fetchBackend('DELETE', `task/${e.task_id}/event/${e.id}`, {})
          .then((response) => response.text())
          .then((text) => console.log('Delete event response: ' + text));
        if (!(e.id in constraints)) { // not an auto-scheduled event
            setTasks((({[e.task_id]: _, ...rest}: any) => rest)(tasks));
            fetchBackend('DELETE', `task/${e.task_id}`, {})
              .then((response) => response.text())
              .then((text) => console.log('Delete task response: ' + text));
        }
    }, [tasks, events]);

    const handleEventChange = useCallback((e: any) => {
        setEvents({...events, [e.id]: mergeState(events[e.id], e)});
        fetchBackend('PATCH', `task/${e.task_id}/event/${e.id}`, e)
          .then((response) => response.text())
          .then((text) => console.log('Patch event response: ' + text));
    }, [events]);

    const handleTaskCreate = useCallback(async (title: String, category: Integer, priority: Integer) => {

        
        const newTask: Task = {
            title: title,
            category: category,
            priority: priority,
        };
        
        try {
            const newTaskResponse = await fetchBackend('POST', 'task', newTask);
            try {
                const newTaskData = await newTaskResponse.json();
                console.log('Create task response: ' + JSON.stringify(newTaskData));
                newTask.id = newTaskData.id;
                setTasks({...tasks, [newTask.id]: newTask});

            } catch (errors) {
                console.log(errors);
                return;
            }
        } catch (errors) {
            console.log(errors);
            return;
        }
        //setConstraints({...constraints, [newConstraint.task_id]: newConstraint});
        //fetchBackend('POST', `task/${newTask.id}/constraint`, newConstraint)
          // .then((response) => response.text())
          // .then((text) => console.log('Create constraint response: ' + text));
        // return newTask.id;
    }, [tasks, constraints]);

    const handleTaskDelete = useCallback((item: Task) => {
        setTasks((({[item.id]: _, ...rest}: any) => rest)(tasks));
        setConstraints((({[item.id]: _, ...rest}: any) => rest)(constraints))
        setEvents(removeTaskEvents(item.id, events));
        fetchBackend('DELETE', `task/${item.id}`, {})
          .then((response) => response.text())
          .then((text) => console.log('Delete task response: ' + text));
    }, [tasks, events, constraints]);

    const handleTaskChange = useCallback((t: any) => {
        setTasks({...tasks, [t.id]: mergeState(tasks[t.id], t)});
        fetchBackend('PATCH', `task/${t.id}`, t)
          .then((response) => response.text())
          .then((text) => console.log('Patch task response: ' + text));
    }, [tasks]);

    const handleSignUp = useCallback((email:string, password:string) => {  
        const credentials = {
            email: email,
            password: password
        };

        getSignUp(credentials);
    });

    const getSignUp = async (data: Object) => {
        try {
            const response = await fetch(
                serverURL + 'users/tokens/sign_up', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            )
            const json = await response.json();

            storeData(json.token).then((response) => console.log("Response: " + response));

        } catch (error) {
            Alert.alert("That email has already been taken");
            console.error(error);
        } 
    }

    const handleSignIn = useCallback((email:string, password:string) => {  
        const credentials = {
            email: email,
            password: password
        };

        getSignIn(credentials);
    });

    const getSignIn = async (data: Object) => {
        try {
            const response = await fetch(
                serverURL + 'users/tokens/sign_in', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            )
            const json = await response.json();

            storeData(json.token).then((response) => console.log("Response: " + response));
            
        } catch (error) {
            Alert.alert("login failed");
            console.error(error);
        } 
    }


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
                <Stack.Screen name="Login" options={{title: "Let's Schedule"}}>
                     {(props) => <LoginPage { ...props}
                        onSignInButtonPress={handleSignIn}/>}
                </Stack.Screen>
                <Stack.Screen name="SignUp" options={{title: "Create Account"}}>
                    {(props) => <SignUpPage { ...props}
                        onSignUpButtonPress={handleSignUp} 
                        />}
                </Stack.Screen>
                <Stack.Screen name="MainTabs" component={MainTabs} options={{headerShown: false}} />
                <Stack.Screen name="EditAutoTask" options={{title: 'Edit Task'}}>
                    {(props) => <EditAutoTaskPage {...props}
                        tasks={tasks} constraints={constraints} onTaskChange={handleTaskChange}
                        onConstraintChange={handleConstraintChange} onComplete={handleAutoSchedule} />}
                </Stack.Screen>
                <Stack.Screen name="EditFixedEvent" options={{title: 'Edit Event'}}>
                    {(props) => <EditFixedEventPage {...props}
                        events={events} 
                        onCreateEvent={handleEventCreate}
                        onEventDelete={handleEventDelete}
                        tasks={tasks} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default gestureHandlerRootHOC(App);
