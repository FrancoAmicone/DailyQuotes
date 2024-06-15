import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quotesData from '../data/data.json';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const DailyQuoteScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Neue: require("../assets/fonts/NeueMontreal-Medium.otf"),
    Shibui: require("../assets/fonts/Shibui.ttf"),
  });

  const [quote, setQuote] = useState(null);

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

  if (!fontsLoaded || !quote) {
    return null;  // Retornamos null mientras se cargan las fuentes o si aún no se ha cargado la cita
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Daily Quotes</Text>
      
      <Image source={{ uri: quote.image }} style={styles.authorImage} />
      <Text style={styles.author}>{quote.author}</Text>
      <Text style={styles.description}>{quote.description}</Text>



      <View style={{
          backgroundColor: '#E9E9E9',          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding:10,
          borderRadius:25,
          elevation: 3,

      }}>

        {/* Mostrar la biografía del autor */}
        <Ionicons name="bookmark-outline" size={30} color="black" style={styles.bio} />
        <Text style={styles.author}>Biografia</Text>

        <Text style={styles.description}>{quote.biography}</Text>
      </View>
        {/* Botón para navegar de regreso a la pantalla de inicio */}
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
    top: '1%',
  },
  authorImage: {
    width: 300,
    height: 400,
    borderRadius: 150,
    margin:25,
  },
  author: {
    margin:10,
    fontSize: 30,
    fontFamily: "Neue",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    fontFamily: "Neue",
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom:20,
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
  bio:{
    marginTop:30,
  },  
});

export default DailyQuoteScreen;
