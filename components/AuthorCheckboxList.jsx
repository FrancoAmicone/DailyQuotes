import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quotesData from '../data/data.json';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const AuthorCheckboxList = ({ navigation }) => {

  const [fontsLoaded] = useFonts({
    Neue: require("../assets/fonts/NeueMontreal-Medium.otf"),
    Shibui: require("../assets/fonts/Shibui.ttf"),
  });

  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [unlockedAuthors, setUnlockedAuthors] = useState([]);
  const [selectionTimestamp, setSelectionTimestamp] = useState(null);

  useEffect(() => {
    const loadSelectedAuthor = async () => {
      const storedAuthor = await AsyncStorage.getItem('selectedAuthor');
      const storedTimestamp = await AsyncStorage.getItem('selectionTimestamp');
      if (storedAuthor) {
        setSelectedAuthor(storedAuthor);
      }
      if (storedTimestamp) {
        setSelectionTimestamp(new Date(parseInt(storedTimestamp)));
      }
    };

    const loadUnlockedAuthors = async () => {
      const storedUnlockedAuthors = await AsyncStorage.getItem('unlockedAuthors');
      if (storedUnlockedAuthors) {
        setUnlockedAuthors(JSON.parse(storedUnlockedAuthors));
      }
    };

    loadSelectedAuthor();
    loadUnlockedAuthors();
  }, []);

  const isWithin24Hours = (timestamp) => {
    const now = new Date();
    const timeDiff = now - timestamp;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff < 24;
  };

  const toggleAuthorSelection = async (author) => {
    if (selectionTimestamp && isWithin24Hours(selectionTimestamp) && selectedAuthor !== author) {
      Alert.alert('Selection Locked', 'You can only change your selected author once every 24 hours.');
      return;
    }

    const selectedAuthorData = quotesData.authors.find(item => item.name === author);
    if (selectedAuthorData.locked && !unlockedAuthors.includes(author)) {
      Alert.alert('Author Locked', 'This author is locked. Watch an ad to unlock.');
      // Aquí se implementaría la lógica para mostrar la publicidad y desbloquear el autor.
      return;
    }

    if (selectedAuthor === author) {
      setSelectedAuthor('');
      await AsyncStorage.removeItem('selectedAuthor');
      await AsyncStorage.removeItem('selectionTimestamp');
      setSelectionTimestamp(null);
    } else {
      const now = new Date();
      setSelectedAuthor(author);
      setSelectionTimestamp(now);
      await AsyncStorage.setItem('selectedAuthor', author);
      await AsyncStorage.setItem('selectionTimestamp', now.getTime().toString());
    }
  };

  const handleConfirmSelection = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Quotes</Text>
      <FlatList
        data={quotesData.authors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.itemContainer,
              selectedAuthor === item.name && styles.selectedItemContainer,
              item.locked && !unlockedAuthors.includes(item.name) && styles.lockedItemContainer,
            ]}
            onPress={() => toggleAuthorSelection(item.name)}
          >
            <Image source={{ uri: item.image }} style={styles.authorImage} />
            <Text style={styles.authorName}>{item.name}</Text>
            {item.locked && !unlockedAuthors.includes(item.name) && <Text style={styles.lockedText}>Locked</Text>}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmSelection}>
        <Ionicons name="checkmark-outline" size={24} color="white" style={styles.icon} />
        <Text style={styles.confirmButtonText}>Confirm Selection</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 50,
    fontFamily: "Shibui",
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingTop:30,
    padding: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 60,
    padding: 10,
  },
  selectedItemContainer: {
    borderColor: 'black',
  },
  lockedItemContainer: {
    backgroundColor: '#d3d3d3',
  },
  authorImage: {
    width: 150,
    height: 100,
    borderRadius: 50,
  },
  authorName: {
    marginLeft: 10,
    fontSize: 15,
    fontFamily: "Neue",
  },
  lockedText: {
    marginLeft: 10,
    fontSize: 14,
    color: 'red',
    fontFamily: "Neue",
  },
  confirmButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: "Neue",
  },
});

export default AuthorCheckboxList;
