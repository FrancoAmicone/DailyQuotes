import 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'expo-dev-client';
import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './components/HomeScreen';
import AuthorCheckboxList from './components/AuthorCheckboxList';
import Settings from './components/Settings';
import quotesData from './data/data.json';


const Stack = createStackNavigator();

const App = () => {


  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

  const scheduleDailyQuoteNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const getRandomQuote = () => {
      const { authors } = quotesData;
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
      const randomQuote = randomAuthor.quotes[Math.floor(Math.random() * randomAuthor.quotes.length)];
      return { quote: randomQuote, author: randomAuthor.name };
    };

    const dailyQuote = getRandomQuote();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Quote",
        body: `"${dailyQuote.quote}" - ${dailyQuote.author}`,
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  };

  useEffect(() => {
    scheduleDailyQuoteNotification();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Daily Quote App' }} />
          <Stack.Screen name="AuthorCheckboxList" component={AuthorCheckboxList} options={{ title: 'Discover Authors' }} />
          <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
