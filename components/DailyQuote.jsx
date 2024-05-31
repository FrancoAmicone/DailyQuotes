// components/DailyQuote.jsx
import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

const DailyQuote = ({ author }) => {
  const randomQuote = author.quotes[Math.floor(Math.random() * author.quotes.length)];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: author.image }}
        style={styles.authorImage}
        imageStyle={{ borderRadius: 400 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.quote}>"{randomQuote}"</Text>
          <Text style={styles.author}>- {author.name}</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  authorImage: {
    width: 500,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 10,
  },
  quote: {
    fontStyle: 'italic',
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
  },
  author: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 25,
  },
});

export default DailyQuote;
