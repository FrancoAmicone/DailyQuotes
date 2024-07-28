import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const DailyQuoteScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Neue: require("../assets/fonts/NeueMontreal-Medium.otf"),
    Shibui: require("../assets/fonts/Shibui.ttf"),
  });

  const [quote, setQuote] = useState(null);

  const imageWidth = useSharedValue(600);
  const imageHeight = useSharedValue(800);

  useEffect(() => {
    const loadSelectedAuthorQuote = async () => {
      try {
        const storedAuthorsData = await AsyncStorage.getItem('authorsData');
        const storedSelectedAuthor = await AsyncStorage.getItem('selectedAuthor');
        if (storedAuthorsData && storedSelectedAuthor) {
          const authorsDataArray = JSON.parse(storedAuthorsData);
          const author = authorsDataArray.find(author => author.name === storedSelectedAuthor);
          if (author) {
            setQuote({
              quote: author.selectedQuote,
              author: author.name,
              image: author.image,
              description: author.description,
              biography: author.biography,
            });
          }
        }
      } catch (error) {
        console.error('Error loading author data:', error);
      }
    };
    loadSelectedAuthorQuote();
  }, []);

  useEffect(() => {
    imageHeight.value = withTiming(500, {
      duration: 2000,
      easing: Easing.inOut(Easing.exp),
    });
  }, [imageHeight]);

  useEffect(() => {
    imageWidth.value = withTiming(420, {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [imageWidth]);

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      width: imageWidth.value,
      height: imageHeight.value,
    };
  });

  if (!fontsLoaded) {
    return null;
  }

  if (!quote) {
    return null;
  }

  const saveQuoteToLocalStorage = async () => {
    try {
      const savedQuotes = await AsyncStorage.getItem('userQuotes');
      let quotesArray = savedQuotes ? JSON.parse(savedQuotes) : [];
      const newQuote = {
        quote: quote.quote,
        author: quote.author,
        image: quote.image,
        description: quote.description,
        biography: quote.biography,
      };
  
      // Evitar duplicados
      if (!quotesArray.some(q => q.quote === newQuote.quote && q.author === newQuote.author)) {
        quotesArray.push(newQuote);
        await AsyncStorage.setItem('userQuotes', JSON.stringify(quotesArray));
        alert('Quote saved!');
      } else {
        alert('This quote is already saved.');
      }
    } catch (error) {
      console.error('Error saving quote:', error);
    }
  };
  


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.Image 
        source={{ uri: quote.image }} 
        style={[styles.authorImage, animatedImageStyle]} 
      />
      <Text style={styles.title}>Daily Quotes</Text>
      <Text style={styles.author}>{quote.author}</Text>

      <Text style={styles.description}>"{quote.quote}"</Text>
      
          <TouchableOpacity onPress={saveQuoteToLocalStorage} style={styles.saveButton}>
            <Ionicons name="bookmark-outline" size={24} color="black" />
            <Text style={styles.saveButtonText}>Guardar Cita</Text>
          </TouchableOpacity>
       
          <TouchableOpacity onPress={() => navigation.navigate('UserQuotes')} style={styles.card}>
          <Ionicons name="list-outline" size={24} color="black" style={styles.icon} />
          <Text style={styles.cardText}>Mis Citas</Text>
        </TouchableOpacity>

      <View style={styles.bioContainer}>
        <Ionicons name="bookmark-outline" size={30} color="black" style={styles.bioIcon} />
        <Text style={styles.author}>Biografía</Text>
        <Text style={styles.description}>{quote.biography}</Text>
      </View>
    
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.card}>
        <Ionicons name="home-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>Inicio</Text>
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
  },
  authorImage: {
    marginTop: -20,
    width: 300,
    height: 800,
    borderBottomLeftRadius: 500,
    borderBottomRightRadius: 500,
    margin: 25,
  },
  author: {
    margin: 10,
    fontSize: 30,
    fontFamily: "Neue",
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
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
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    marginTop: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Neue",
    marginLeft: 5,
  },  
});

export default DailyQuoteScreen;
