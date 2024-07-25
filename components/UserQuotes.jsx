import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userQuotes.length > 0 ? (
        userQuotes.map((quote, index) => (
          <View key={index} style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{quote.quote}"</Text>
            <Text style={styles.authorText}>- {quote.author}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noQuotesText}>No quotes saved yet.</Text>
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
  },
  quoteText: {
    fontSize: 18,
    fontFamily: 'Neue',
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
});

export default UserQuotes;
