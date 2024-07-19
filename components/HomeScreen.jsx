import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import quotesData from '../data/data.json';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const HomeScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Neue: require("../assets/fonts/NeueMontreal-Medium.otf"),
    Shibui: require("../assets/fonts/Shibui.ttf"),
  });

  const translateY = useSharedValue(100);
  
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const loadSelectedAuthor = async () => {
    const storedSelectedAuthor = await AsyncStorage.getItem('selectedAuthor');
    const storedAuthorsData = await AsyncStorage.getItem('authorsData');
    const currentTime = new Date().getTime();
    let authorsDataArray;

    if (storedAuthorsData) {
      authorsDataArray = JSON.parse(storedAuthorsData);

      authorsDataArray = authorsDataArray.map(author => {
        if (currentTime - author.timestamp >= 24 * 60 * 60 * 1000) {
          // Si han pasado más de 24 horas, actualiza la frase
          const newQuote = author.quotes[Math.floor(Math.random() * author.quotes.length)];
          return {
            ...author,
            selectedQuote: newQuote,
            timestamp: currentTime
          };
        }
        return author;
      });

      await AsyncStorage.setItem('authorsData', JSON.stringify(authorsDataArray));

      if (storedSelectedAuthor) {
        const author = authorsDataArray.find(author => author.name === storedSelectedAuthor);
        if (author) {
          setSelectedAuthor(author);
        }
      }
    } else {
      authorsDataArray = quotesData.authors.map(author => ({
        ...author,
        selectedQuote: author.quotes[Math.floor(Math.random() * author.quotes.length)],
        timestamp: currentTime
      }));

      await AsyncStorage.setItem('authorsData', JSON.stringify(authorsDataArray));

      if (storedSelectedAuthor) {
        const author = authorsDataArray.find(author => author.name === storedSelectedAuthor);
        if (author) {
          setSelectedAuthor(author);
        }
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSelectedAuthor();
    }, [])
  );

  useEffect(() => {
    translateY.value = withTiming(0, {
      duration: 2000,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const handleLongPress = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      navigation.navigate('DailyQuote', { image: selectedAuthor.image });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.title}>Daily Quotes</Text>
      {selectedAuthor ? (
        <LongPressGestureHandler onHandlerStateChange={handleLongPress} minDurationMs={800}>
          <View>
            <ImageBackground
              source={{ uri: selectedAuthor.image }}
              style={styles.authorImage}
              imageStyle={{ borderRadius: 400 }}
            >
              <View style={styles.overlay}>
                <Text style={styles.author}>{selectedAuthor.name}</Text>
                <ScrollView style={styles.scrollContainer}>
                  <Text style={styles.quote}>"{selectedAuthor.selectedQuote}"</Text>
                </ScrollView>
              </View>
            </ImageBackground>
          </View>
        </LongPressGestureHandler>
      ) : (
        <View style={styles.welcomeContainer}>
          <Image source={require('../assets/welcome-logo.png')} style={styles.welcomeImage} />
          <Text style={styles.welcomeText}>
            Hola 👋! {"\n"} Bienvenido, no tienes ningún autor seleccionado {"\n"} Por favor, selecciona uno de la lista.
          </Text>
        </View>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('AuthorCheckboxList')} style={styles.card}>
        <Ionicons name="book" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>Descubre autores</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.card}>
        <Ionicons name="settings" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>Configuración</Text>
      </TouchableOpacity>
      <View style={styles.ads}>
        <BannerAd size={BannerAdSize.FULL_BANNER} unitId={TestIds.BANNER} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    marginBottom: 20,
    fontFamily: "Shibui",
    textAlign: 'center',
    top: '1%',
  },
  authorImage: {
    width: 300,
    height: 550,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 1000,
    padding: 20,
    position: 'absolute',
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    top: 270,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  quote: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontFamily: "Neue",
    flexShrink: 1,
  },
  author: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    fontFamily: "Neue",
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 9,
    borderRadius: 10,
    elevation: 3,
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
  cardText: {
    fontSize: 16,
    fontFamily: "Neue",
  },
  welcomeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeImage: {
    width: 200,
    height: 200,
    marginBottom: 180,
    marginTop: 100,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: "Neue",
  },
  ads: {
    marginTop: 10,
  },
});

export default HomeScreen;
