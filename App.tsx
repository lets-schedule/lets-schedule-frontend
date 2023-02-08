import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import EditEventPage from './src/components/EditEventPage';
import {commStyles} from './src/components/Util';

function mergeState(prevState: any, update: any) {
  const merged = {...prevState, ...update};
  console.log(merged);
  return merged;
}

function mergeStateAction(update: any) {
  return (prevState: any) => mergeState(prevState, update);
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [event, setEvent] = useState({id: 0, taskId: 0, startTime: new Date(), endTime: new Date()});
  const [task, setTask] = useState({title: 'cool event', category: 0, priority: 2});
  const [repeat, setRepeat] = useState({repeat: true, until: new Date(), days: [true, false, false, true, true, true, false]});
  const [constraint, setConstraint] = useState({id: 0, dueTime: new Date(), duration: 5000 * 60 * 60});

  const handleEventChange = useCallback((e: any) => setEvent(mergeStateAction(e)), []);
  const handleTaskChange = useCallback((t: any) => setTask(mergeStateAction(t)), []);
  const handleRepeatChange = useCallback((r: any) => setRepeat(mergeStateAction(r)), []);
  const handleConstraintChange = useCallback((c: any) => setConstraint(mergeStateAction(c)), []);

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={commStyles.expand}>
        <EditEventPage
          event={event} onEventChange={handleEventChange}
          task={task} onTaskChange={handleTaskChange}
          repeat={repeat} onRepeatChange={handleRepeatChange} 
          style={commStyles.grow}
            />
      </View>
    </SafeAreaView>
  );
}

export default App;
