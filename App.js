import 'react-native-gesture-handler';
import 'react-native-reanimated';
import 'expo-dev-client';
import React,{useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './components/HomeScreen';
import AuthorCheckboxList from './components/AuthorCheckboxList';
import Settings from './components/Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DailyQuoteScreen from './components/DailyQuoteScreen';
import OnBoardingScreen from './components/OnBoardingScreen';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    Neue: require("./assets/fonts/NeueMontreal-Medium.otf"),
    Shibui: require("./assets/fonts/Shibui.ttf"),
  });
  
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error("Error checking if it's the first launch:", error);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    // Puedes mostrar una pantalla de carga mientras se verifica
    return null;
  }




  if (!fontsLoaded) {
    return null;
  }

  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
        initialRouteName={isFirstLaunch ? 'OnBoarding' : 'Home'}
        screenOptions={{
          headerShown: false,
        }} >
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Daily Quote App' }} />
          <Stack.Screen name="AuthorCheckboxList" component={AuthorCheckboxList} options={{ title: 'Discover Authors' }} />
          <Stack.Screen name="Settings" component={Settings} options={{ title: 'Settings' }} />
          <Stack.Screen name="DailyQuote" component={DailyQuoteScreen} options={{ title: 'Info' }} />
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} options={{ title: 'On Boarding' }} />

        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
