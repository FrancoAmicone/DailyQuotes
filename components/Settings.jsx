import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import quotesData from '../data/data.json';

const Settings = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Neue: require("../assets/fonts/NeueMontreal-Medium.otf"),
    Shibui: require("../assets/fonts/Shibui.ttf"),
  });

  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const storedTime = await AsyncStorage.getItem('notificationTime');
      if (storedTime) {
        setSelectedTime(new Date(storedTime));
      }
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(status === 'granted');
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
      Alert.alert('No author selected', 'Please select an author from the list.');
      return;
    }

    const author = quotesData.authors.find(author => author.name === storedAuthor);
    if (!author) {
      Alert.alert('Author not found', 'The selected author was not found in the database.');
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Tu Frase diaria de ${author.name}`,
        body: author.quotes[Math.floor(Math.random() * author.quotes.length)],
        data: { author: author.name },
      },
      trigger: {
        hour: selectedTime.getHours(),
        minute: selectedTime.getMinutes(),
        repeats: true,
      },
    });

    await AsyncStorage.setItem('notificationTime', selectedTime.toISOString());
    Alert.alert('Notification guardada correctamente', `Vas a recibir una frase de ${author.name} todos los dias a las ${selectedTime.toLocaleTimeString()}`);
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Porfavor activa las notificaciones en configuracion.');
        return;
      }
      setNotificationsEnabled(true);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotificationsEnabled(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      <TouchableOpacity onPress={toggleNotifications} style={styles.card}>
        <Ionicons name={notificationsEnabled ? "notifications" : "notifications-off"} size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>
          {notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}
        </Text>
      </TouchableOpacity>
      
      {notificationsEnabled && (
        <>
              <Text style={styles.p}>Selecciona la hora a la que quieres recibir la notificación.</Text>

          <Text style={styles.cardText}>Hora seleccionada: {selectedTime.toLocaleTimeString()}</Text>
          <TouchableOpacity style={styles.card} onPress={() => setShowTimePicker(true)}>
            <Ionicons name="alarm-outline" size={24} color="black" style={styles.icon} />
            <Text style={styles.cardText}>Seleccionar hora</Text>
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
          <TouchableOpacity onPress={scheduleNotification} style={styles.cardSetting}>
            <Ionicons name="checkmark-circle-outline" size={24} color="green" style={styles.icon} />
            <Text style={styles.cardText}>Guardar Configuracion</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.card}>
        <Ionicons name="home-outline" size={24} color="black" style={styles.icon} />
        <Text style={styles.cardText}>Volver a home</Text>
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
  p: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: "Neue",
    margin:5,
  },
  title: {
    fontSize: 40,
    marginBottom: 100,
    margin: 50,
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
    fontFamily: "Neue",
    margin:10,
  },
  cardSetting: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D2FFDB',
    padding: 9,
    borderRadius: 10,
    elevation: 3,
    marginTop: 20,
    fontFamily: "Neue",
  },
  icon: {
    marginRight: 10,
  },
  cardText: {
    fontSize: 16,
    fontFamily: "Neue",
  },
});

export default Settings;
