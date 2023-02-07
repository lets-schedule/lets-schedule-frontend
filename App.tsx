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

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [event, setEvent] = useState({id: 0, taskId: 0, startTime: new Date(), endTime: new Date()});
  const [task, setTask] = useState({title: 'cool event', category: 0, priority: 3});
  const [repeat, setRepeat] = useState({repeat: true, until: new Date(), days: [true, false, false, true, true, true, false]});

  const handleEventChange = useCallback((e: any) => {
    setEvent((ePrev) => {return {...ePrev, ...e}});
    // console.log(e);
  }, []);
  const handleTaskChange = useCallback((t: any) => {
    setTask((tPrev) => {return {...tPrev, ...t}});
    // console.log(t);
  }, []);
  const handleRepeatChange = useCallback((r: any) => {
    setRepeat((rPrev) => {return {...rPrev, ...r}});
    // console.log(r);
  }, []);

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
