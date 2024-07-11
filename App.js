import 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'expo-dev-client';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './components/HomeScreen';
import AuthorCheckboxList from './components/AuthorCheckboxList';
import Settings from './components/Settings';
import DailyQuoteScreen from './components/DailyQuoteScreen';

const Stack = createStackNavigator();

const App = () => {
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false, // Oculta la barra de navegación
        }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Daily Quote App' }} />
          <Stack.Screen name="AuthorCheckboxList" component={AuthorCheckboxList} options={{ title: 'Discover Authors' }} />
          <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }} />
          <Stack.Screen name="DailyQuote" component={DailyQuoteScreen} options={{ title: 'Info' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
