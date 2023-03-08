import React, { useState, useCallback, useMemo } from 'react';
import { LogBox, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import TaskList from './src/components/TaskList';
import { Event, Constraint, Task } from './src/Model';
import { mergeState, startOfHour } from './src/Util';
import EditAutoTaskPage from './src/components/EditAutoTaskPage';
import WeekCalendar from './src/components/WeekCalendar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EditFixedEventPage from './src/components/EditFixedEventPage';
import { removeTaskEvents, scheduleTaskEvents } from './src/AutoSchedule';
import LoginPage from './src/components/LoginPage';
import SignUpPage from './src/components/SignUpPage';

const RootStack = createNativeStackNavigator();
const UserStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const serverURL = "http://52.12.169.220:3000/";

const curDate = new Date(); // TODO: update time!!

type Authorization = {
    authToken: string;
    refresh_token: string;
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
    const [email, setEmail]: [String, Function] = useState('');

    const handleSignUp = useCallback((email:string, password:string, navigation:any) => {  
        const credentials = {
            email: email,
            password: password
        };

        getSignUp(credentials)
            .then(pullAllObjects)
            .then((params) => navigation.navigate("SignedIn", params));
    }, []);

    const getSignUp = async (data: Object): Promise<Authorization> => {
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
            return {
               authToken: json.token,
               refresh_token: json.refresh_token,
               userEmail: json.resource_owner.email
            }
        } catch (error) {
            Alert.alert("That email has already been taken");
            console.error(error);
        } 
    }

    const handleSignIn = useCallback((email:string, password:string, navigation:any) => {  
        const credentials = {
            email: email,
            password: password
        };

        getSignIn(credentials)
            .then(pullAllObjects)
            .then((params) => navigation.navigate("SignedIn", params));
    }, []);

    const getSignIn = async (data: Object): Promise<Authorization> => {
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
            return {
               authToken: json.token,
               refresh_token: json.refresh_token,
               userEmail: json.resource_owner.email
            }
        } catch (error) {
            Alert.alert("login failed");
            console.error(error);
        } 
    }

    const handleEmailChange = useCallback((t: any) => {
        setEmail({email: t});
        console.log("set email to:" + t);
    }, [setEmail]);

    const getEmail = () => {
        Alert.alert("Well at least this is working");
    }

    return (
        <NavigationContainer>
            <RootStack.Navigator initialRouteName="Login">
                <RootStack.Screen name="Login" options={{title: "Let's Schedule"}}>
                     {(props) => <LoginPage { ...props}
                        onSignInButtonPress={handleSignIn}/>}
                </RootStack.Screen>
                <RootStack.Screen name="SignUp" options={{title: "Create Account"}}>
                    {(props) => <SignUpPage { ...props}
                        onSignUpButtonPress={handleSignUp} 
                        />}
                </RootStack.Screen>
                <RootStack.Screen name="SignedIn" options={{headerShown: false}}
                    component={SignedInApp} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}

function fetchBackendWithAuth(method: string, path: string, bodyObj: object, auth: Authorization):
        Promise<Response> {
    const request =  {
        method: method,
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + auth.authToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyObj),
    };
    console.log('Sending request to ' + path + ': ' + JSON.stringify(request));
    return fetch(serverURL + path, request);
}

async function pullAllObjects(auth: Authorization) {
    const getEventsResponse = await fetchBackendWithAuth('GET', 'event', undefined, auth);
    const eventsData = await getEventsResponse.json();
    const getTasksResponse = await fetchBackendWithAuth('GET', 'task', undefined, auth);
    const tasksData = await getTasksResponse.json();
    const getConstraintsResponse = await fetchBackendWithAuth('GET', 'constraint', undefined, auth);
    const constraintsData = await getConstraintsResponse.json();

    let tasks: Record<number, Task> = {};
    for (const t of tasksData) {
        tasks[t.id] = {
            id: t.id,
            title: t.title,
            category: t.category,
            priority: t.priority,
        };
    }

    let events: Record<number, Event> = {};
    for (const e of eventsData) {
        events[e.id] = {
            id: e.id,
            task_id: e.task_id,
            startTime: new Date(e.startTime),
            endTime: new Date(e.endTime),
        };
    }

    let constraints: Record<number, Constraint> = {};
    for (const c of constraintsData) {
        constraints[c.id] = {
            task_id: c.task_id,
            dueTime: new Date(c.dueTime),
            duration: c.duration
        };
    }

    return {tasks: tasks, events: events, constraints: constraints, auth: auth};
};

function SignedInApp({ route, navigation, ...props}: any) {
    const {auth} = route.params;

    const [events, setEvents]: [Record<number, Event>, Function] = useState(route.params.events);
    const [tasks, setTasks]: [Record<number, Task>, Function] = useState(route.params.tasks);
    const [constraints, setConstraints]: [Record<number, Constraint>, Function] =
        useState(route.params.constraints);

    const fetchBackend = useCallback((method: string, path: string, bodyObj: object) =>
        fetchBackendWithAuth(method, path, bodyObj, auth),
    [auth]);

    const curWeek = useMemo(() => {
        let date = new Date(curDate);
        date.setDate(date.getDate() - date.getDay());
        return date;
    }, []);

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
    }, [events, fetchBackend])

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
    }, [tasks, events, fetchBackend]);

    const handleEventChange = useCallback((e: any) => {
        setEvents({...events, [e.id]: mergeState(events[e.id], e)});
    }, [events, fetchBackend]);

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
    }, [tasks, constraints, fetchBackend]);

    const handleTaskDelete = useCallback((item: Task) => {
        setTasks((({[item.id]: _, ...rest}: any) => rest)(tasks));
        setConstraints((({[item.id]: _, ...rest}: any) => rest)(constraints))
        let newEvents = events;
        removeTaskEvents(item.id, events, eventId => {
            let {[eventId]: _, ...rest} = newEvents;
            newEvents = rest;
        });
        setEvents(newEvents);
        fetchBackend('DELETE', `task/${item.id}`, {})
          .then((response) => response.text())
          .then((text) => console.log('Delete task response: ' + text));
    }, [tasks, events, constraints, fetchBackend]);

    const handleTaskChange = useCallback((t: any) => {
        setTasks({...tasks, [t.id]: mergeState(tasks[t.id], t)});
    }, [tasks, fetchBackend]);

    const handleConstraintChange = useCallback((c: any) => {
        setConstraints({...constraints, [c.task_id]: mergeState(constraints[c.task_id], c)});
    }, [constraints, fetchBackend]);

    const getDayEvents = useCallback((date: Date) =>
        Object.values(events).filter((value: Event) =>
            value.startTime.getDate() == date.getDate()
            && value.startTime.getMonth() == date.getMonth()
            && value.startTime.getFullYear() == date.getFullYear()), [events]);

    const handleEventComplete = useCallback((eventId: number) => {
        const event = events[eventId];
        fetchBackend('PATCH', `task/${event.task_id}`, tasks[event.task_id])
            .then((response) => response.text())
            .then((text) => console.log('Patch task response: ' + text));
        fetchBackend('PATCH', `task/${event.task_id}/event/${eventId}`, event)
          .then((response) => response.text())
          .then((text) => console.log('Patch event response: ' + text));
    }, [events])

    const handleTaskComplete = useCallback(async (task_id: number) => {
        fetchBackend('PATCH', `task/${task_id}`, tasks[task_id])
            .then((response) => response.text())
            .then((text) => console.log('Patch task response: ' + text));
        fetchBackend('PATCH', `task/${task_id}/constraint`, constraints[task_id])
            .then((response) => response.text())
            .then((text) => console.log('Patch constraint response: ' + text));

        let newEvents = events;
        removeTaskEvents(task_id, events, eventId => {
            const event = newEvents[eventId];
            fetchBackend('DELETE', `task/${event.task_id}/event/${eventId}`, {})
                .then((response) => response.text())
                .then((text) => console.log('Delete event response: ' + text));

            let {[eventId]: _, ...rest} = newEvents;
            newEvents = rest;
        });
        setEvents(newEvents);
        await scheduleTaskEvents(task_id, constraints[task_id], newEvents, curDate, async (e) => {
            const newEventResponse = await fetchBackend('POST', `task/${task_id}/event`, e);
            const newEventData = await newEventResponse.json();
            console.log('Create event response: ' + JSON.stringify(newEventData));
            e.id = newEventData.id;
            newEvents = {...newEvents, [e.id]: e};
        });
        setEvents(newEvents);
    }, [tasks, events, constraints]);

    const MainTabs = useCallback((props: any) => (
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
    ), [curWeek, curDate, tasks, constraints, handleEventCreate, getDayEvents, handleTaskCreate, handleTaskDelete]);

    return <UserStack.Navigator>
        <UserStack.Screen name="MainTabs" component={MainTabs} options={{headerShown: false}} />
        <UserStack.Screen name="EditAutoTask" options={{title: 'Edit Task'}}>
            {(props) => <EditAutoTaskPage {...props}
                tasks={tasks} constraints={constraints} onTaskChange={handleTaskChange}
                onConstraintChange={handleConstraintChange} onComplete={handleTaskComplete} />}
        </UserStack.Screen>
        <UserStack.Screen name="EditFixedEvent" options={{title: 'Edit Event'}}>
            {(props) => <EditFixedEventPage {...props}
                events={events} onEventChange={handleEventChange}
                onEventDelete={handleEventDelete}
                tasks={tasks} onTaskChange={handleTaskChange} onComplete={handleEventComplete} />}
        </UserStack.Screen>
    </UserStack.Navigator>
}

export default gestureHandlerRootHOC(App);
