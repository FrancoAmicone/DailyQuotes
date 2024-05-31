import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

import quotesData from '../data/data.json';

const Settings = ({ navigation }) => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const storedTime = await AsyncStorage.getItem('notificationTime');
      if (storedTime) {
        setSelectedTime(new Date(storedTime));
      }
    };
    loadSettings();
  }, []);

  const handleTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedTime;
    setShowTimePicker(false);
    setSelectedTime(currentDate);
  };

  const scheduleNotification = async () => {
    const storedAuthor = await AsyncStorage.getItem('selectedAuthor');
    if (!storedAuthor) {
      Alert.alert('No author selected', 'Please select an author from the settings.');
      return;
    }

    const author = quotesData.authors.find(author => author.name === storedAuthor);
    if (!author) {
      Alert.alert('Author not found', 'The selected author was not found in the database.');
      return;
    }

    const randomQuote = author.quotes[Math.floor(Math.random() * author.quotes.length)];

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Quote of the day from ${author.name}`,
        body: randomQuote,
        data: { quote: randomQuote },
      },
      trigger: {
        hour: selectedTime.getHours(),
        minute: selectedTime.getMinutes(),
        repeats: true,
      },
    });

    await AsyncStorage.setItem('notificationTime', selectedTime.toISOString());
    Alert.alert('Notification scheduled', `You'll receive a quote from ${author.name} every day at ${selectedTime.toLocaleTimeString()}`);
  };

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please enable notifications in your settings.');
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.cardText}>{selectedTime.toLocaleTimeString()}</Text>

      <TouchableOpacity style={styles.card} onPress={() => setShowTimePicker(true)}>
        <Ionicons name="alarm-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>Select Time:</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleTimeChange}
        />
      )}
      <TouchableOpacity  onPress={scheduleNotification} style={styles.card}>
        <Ionicons name="checkmark-circle-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>Save Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => navigation.navigate('Home')} style={styles.card}>
        <Ionicons name="home-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>Back to Home</Text>
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
    fontSize: 20,
    marginBottom: 20,
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
  },
});

export default Settings;
