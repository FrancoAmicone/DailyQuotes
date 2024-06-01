import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import quotesData from '../data/data.json';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';


const HomeScreen = ({ navigation }) => {
  const  [fontsLoaded] = useFonts({
    Neue: require("../assets/fonts/NeueMontreal-Medium.otf"),
    Shibui: require("../assets/fonts/Shibui.ttf"),
   
    //"Shibui.ttf"

  });


  const [quote, setQuote] = useState(null);

  const loadSelectedAuthor = async () => {
    const storedAuthor = await AsyncStorage.getItem('selectedAuthor');
    if (storedAuthor) {
      const author = quotesData.authors.find(author => author.name === storedAuthor);
      if (author) {
        const randomQuote = author.quotes[Math.floor(Math.random() * author.quotes.length)];
        setQuote({ quote: randomQuote, author: author.name, image: author.image });
      }
    } else {
      setQuote({ quote: "No authors selected. Please select authors in Descover Authors.", author: "Welcome to Daily Quotes", image: "" });
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSelectedAuthor();
    }, [])
  );

  useEffect(() => {
    loadSelectedAuthor();
  }, []);

  return (
    <View style={styles.container} >
      <Text style={styles.title}>Daily Quotes</Text>
      {quote && (
        <ImageBackground
          source={{ uri: quote.image }}
          style={styles.authorImage}
          imageStyle={{ borderRadius: 400 }}
        >
          <View style={styles.overlay}>
       
            <Text style={styles.author}>{quote.author ? ` ${quote.author}` : ""}</Text>
            <Text style={styles.quote}>"{quote.quote}"</Text>
          </View>
        </ImageBackground>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('AuthorCheckboxList')} style={styles.card}>
        <Ionicons name="book" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>Discover Authors</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.card}>
        <Ionicons name="settings" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 50,
    marginBottom: 20,
    fontFamily:"Shibui",
  },
  authorImage: {
    width: 300,
    height: 550,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  quote: {
    
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 20,
    fontFamily:"Neue",
  },
  author: {
    
    color: 'white',
    fontSize: 23,
    textAlign: 'center',
    marginTop: 10,
    fontFamily:"Neue",
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
    fontFamily:"Neue",
  },
});

export default HomeScreen;
