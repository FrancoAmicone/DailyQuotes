import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quotesData from '../data/data.json';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const DailyQuoteScreen = ({ navigation, route }) => {
  const [fontsLoaded] = useFonts({
    Neue: require("../assets/fonts/NeueMontreal-Medium.otf"),
    Shibui: require("../assets/fonts/Shibui.ttf"),
  });

  const [quote, setQuote] = useState(null);

  // Añadir useSharedValue y useAnimatedStyle fuera de cualquier condición
  const imageWidht = useSharedValue(600);
  const imageHeight = useSharedValue(800);

  useEffect(() => {
    const loadSelectedAuthor = async () => {
      try {
        const storedAuthor = await AsyncStorage.getItem('selectedAuthor');
        if (storedAuthor) {
          const author = quotesData.authors.find(author => author.name === storedAuthor);
          if (author) {
            const randomQuote = author.quotes[Math.floor(Math.random() * author.quotes.length)];
            setQuote({ 
              quote: randomQuote, 
              author: author.name, 
              image: author.image, 
              description: author.description, 
              biography: author.biography 
            });
          }
        }
      } catch (error) {
        console.error('Error loading author data:', error);
      }
    };
    loadSelectedAuthor();
  }, []);

  // Mover useEffect de animación fuera de cualquier condición
  useEffect(() => {
    imageHeight.value = withTiming(500, {
      duration: 2000,
      easing: Easing.inOut(Easing.exp),
    });
  }, [imageHeight]);
  useEffect(() => {
    imageWidht.value = withTiming(420, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [imageWidht]);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      width: imageWidht.value,
      height: imageHeight.value,
    };
  });

  // Verificar si las fuentes están cargadas antes de renderizar
  if (!fontsLoaded) {
    return null;
  }

  // Verificar si la cita está cargada antes de renderizar
  if (!quote) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Animated.Image 
        source={{ uri: quote.image }} 
        style={[styles.authorImage, animatedImageStyle]} 
      />
            <Text style={styles.title}>Daily Quotes</Text>

      <Text style={styles.author}>{quote.author}</Text>
      <Text style={styles.description}>{quote.description}</Text>

      <View style={styles.bioContainer}>
        <Ionicons name="bookmark-outline" size={30} color="black" style={styles.bioIcon} />
        <Text style={styles.author}>Biografia</Text>
        <Text style={styles.description}>{quote.biography}</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.card}>
        <Ionicons name="home-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}></Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 50,
    marginBottom: 20,
    fontFamily: "Shibui",
    textAlign: 'center',
    top: '0%',
  },
  authorImage: {
    marginTop:-20,
    width: 300,
    height: 800,
    borderBottomLeftRadius:500,
    borderBottomRightRadius:500,

    margin: 25,
  },
  author: {
    margin: 10,
    fontSize: 30,
    fontFamily: "Neue",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    fontFamily: "Neue",
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bioContainer: {
    backgroundColor: '#E9E9E9',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 25,
    elevation: 3,
  },
  bioIcon: {
    marginTop: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 9,
    borderRadius: 10,
    elevation: 3,
    marginTop: 20,
    fontFamily: "Neue",
  },
  icon: {
    margin: 5,
  },
  cardText: {
    fontSize: 16,
    fontFamily: "Neue",
  },
});

export default DailyQuoteScreen;
