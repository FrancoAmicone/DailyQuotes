import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import quotesData from '../data/data.json';
import { useFocusEffect } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

let Tittle = 'Daily Quotes'

const HomeScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Neue: require("../assets/fonts/NeueMontreal-Medium.otf"),
    Shibui: require("../assets/fonts/Shibui.ttf"),
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
      setQuote(null);
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
    <View style={styles.container}>
      <Text style={styles.title}>{Tittle}</Text>
      {quote ? (
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
      ) : (
        <View style={styles.welcomeContainer}>
          <Image source={require('../assets/welcome-logo.png')} style={styles.welcomeImage} />
          <Text style={styles.welcomeText}>Hey 👋! {"\n"} You have not chosen an author {"\n"} Please select one from the list.</Text>
        </View>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('AuthorCheckboxList')} style={styles.card}>
        <Ionicons name="book" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>Discover Authors</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.card}>
        <Ionicons name="settings" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>Settings</Text>
      </TouchableOpacity>
      
      <View style={styles.ads}>
      <BannerAd  size={BannerAdSize.FULL_BANNER} unitId={TestIds.BANNER} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop:40,


  },
  title: {
    fontSize: 50,
    marginBottom: 20,
    fontFamily: "Shibui",
    textAlign: 'center',
    top:'1%',

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
  quote: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 20,
    fontFamily: "Neue",
  },
  author: {
    color: 'white',
    fontSize: 23,
    textAlign: 'center',
    marginBottom: 10,
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
    marginBottom: 180,  marginTop: 100,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: "Neue",
  },
  ads: {
    marginTop:10,
  },

});

export default HomeScreen;
