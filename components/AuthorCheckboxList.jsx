import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import quotesData from '../data/data.json';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const AuthorCheckboxList = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Neue: require("../assets/fonts/NeueMontreal-Medium.otf"),
    Shibui: require("../assets/fonts/Shibui.ttf"),
  });

  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [unlockedAuthors, setUnlockedAuthors] = useState([]);
  const [quotes, setQuotes] = useState(quotesData.authors);
  const [loaded, setLoaded] = useState(false);
  const currentAuthorToUnlock = useRef(null);

  useEffect(() => {
    const loadSelectedAuthor = async () => {
      const storedAuthor = await AsyncStorage.getItem('selectedAuthor');
      if (storedAuthor) {
        setSelectedAuthor(storedAuthor);
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

  useEffect(() => {
    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        unlockAuthor(currentAuthorToUnlock.current);
      }
    );

    rewardedAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const unlockAuthor = async (author) => {
    setUnlockedAuthors((prev) => {
      const updatedAuthors = [...prev, author];
      AsyncStorage.setItem('unlockedAuthors', JSON.stringify(updatedAuthors));
      return updatedAuthors;
    });

    setQuotes((prevQuotes) => {
      return prevQuotes.map((quote) => {
        if (quote.name === author) {
          return { ...quote, locked: false };
        }
        return quote;
      });
    });
  };

  const toggleAuthorSelection = async (author) => {
    const selectedAuthorData = quotes.find(item => item.name === author);
    if (selectedAuthorData.locked && !unlockedAuthors.includes(author)) {
      currentAuthorToUnlock.current = author;
      if (loaded) {
        rewardedAd.show();
      } else {
        Alert.alert('Ad Not Ready', 'The ad is not ready yet. Please try again later.');
        rewardedAd.load();
      }
      return;
    }

    if (selectedAuthor === author) {
      setSelectedAuthor('');
      await AsyncStorage.removeItem('selectedAuthor');
    } else {
      setSelectedAuthor(author);
      await AsyncStorage.setItem('selectedAuthor', author);
    }
  };

  const handleConfirmSelection = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Quotes</Text>
      <FlatList
        data={quotes}
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
            {item.locked && !unlockedAuthors.includes(item.name) && (
              <Ionicons name="lock-open" size={24} color="black" style={styles.lockedIcon} />
            )}
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
    paddingTop: 30,
    padding: 5,
    margin:20,
    top:'-03%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 60,
    padding: 10,
    position: 'relative',
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
    fontSize: 16,
    fontFamily: "Neue",
  },
  lockedIcon: {
    position: 'absolute',
    right: "05%",
    top: '50%',
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
