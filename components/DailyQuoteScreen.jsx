// components/DailyQuoteScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quotesData from '../data/data.json';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const DailyQuoteScreen = ({navigation}) => {
  const [fontsLoaded] = useFonts({
    Neue: require("../assets/fonts/NeueMontreal-Medium.otf"),
    Shibui: require("../assets/fonts/Shibui.ttf"),
  });
  
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const loadSelectedAuthor = async () => {
      const storedAuthor = await AsyncStorage.getItem('selectedAuthor');
      if (storedAuthor) {
        const author = quotesData.authors.find(author => author.name === storedAuthor);
        if (author) {
          const randomQuote = author.quotes[Math.floor(Math.random() * author.quotes.length)];
          setQuote({ quote: randomQuote, author: author.name, image: author.image, description: author.description });
        }
      }
    };
    loadSelectedAuthor();
  }, []);

  if (!fontsLoaded || !quote) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daily Quote</Text>
      <Image source={{ uri: quote.image }} style={styles.authorImage} />
      <Text style={styles.author}>{quote.author}</Text>
      <Text style={styles.description}>{quote.description}</Text>

      <TouchableOpacity  onPress={() => navigation.navigate('Home')} style={styles.card}>
        <Ionicons name="home-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>Back to Home</Text>
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
    fontSize: 36,
    marginBottom: 20,
    fontFamily: "Shibui",
  },
  authorImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
    marginBottom: 20,
  },
  author: {
    fontSize: 30,
    fontFamily: "Neue",
    marginBottom: 10,
  },
  quote: {
    fontSize: 18,
    fontFamily: "Neue",
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 18,
    fontFamily: "Neue",
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 9,
    borderRadius: 10,
    elevation: 3,
    marginTop: 20,
    fontFamily:"Neue",
  },
  icon: {
  marginRight: 10,
},
cardText: {
  fontSize: 16,
  fontFamily:"Neue",
},
});

export default DailyQuoteScreen;
