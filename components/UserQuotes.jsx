import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const UserQuotes = () => {
  const [userQuotes, setUserQuotes] = useState([]);

  useEffect(() => {
    const loadUserQuotes = async () => {
      try {
        const savedQuotes = await AsyncStorage.getItem('userQuotes');
        if (savedQuotes) {
          setUserQuotes(JSON.parse(savedQuotes));
        }
      } catch (error) {
        console.error('Error loading user quotes:', error);
      }
    };

    loadUserQuotes();
  }, []);

  const deleteQuote = async (index) => {
    const updatedQuotes = userQuotes.filter((_, i) => i !== index);
    setUserQuotes(updatedQuotes);
    await AsyncStorage.setItem('userQuotes', JSON.stringify(updatedQuotes));
  };

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Daily Quotes</Text>

      {userQuotes.length > 0 ? (
        userQuotes.map((quote, index) => (
          <View key={index} style={styles.quoteContainer}>
            <Image source={{ uri: quote.image }} style={styles.authorImage} />
            <Text style={styles.quoteText}>"{quote.quote}"</Text>
            <Text style={styles.authorText}>- {quote.author}</Text>
            <TouchableOpacity onPress={() => deleteQuote(index)} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noQuotesText}>No tienes frases guardadas.</Text>
      )}
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
  quoteContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  authorImage: {
    width: 300,
    height: 150,
    borderRadius: 25,
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 18,
    fontFamily: 'Neue',
    textAlign: 'center',
  },
  title: {
    fontSize: 50,
    marginBottom: 20,
    fontFamily: "Shibui",
    textAlign: 'center',
    top: '1%',
  },
  authorText: {
    fontSize: 16,
    fontFamily: 'Neue',
    textAlign: 'right',
    marginTop: 10,
  },
  noQuotesText: {
    fontSize: 18,
    fontFamily: 'Neue',
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 10,
    elevation: 3,
  },
});

export default UserQuotes;
