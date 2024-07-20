import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const SkipButton = ({ ...props }) => (
  <TouchableOpacity  {...props}>
  </TouchableOpacity>
);

const NextButton = ({ ...props }) => (
  <TouchableOpacity style={styles.button} {...props}>
    <Text style={styles.buttonText}>Siguiente</Text>
  </TouchableOpacity>
);

const OnBoardingScreen = ({ navigation }) => (
  <Onboarding
    SkipButtonComponent={SkipButton}
    NextButtonComponent={NextButton}
    onDone={() => navigation.navigate('Home')}
    pages={[
      {
        backgroundColor: '#f6f6f6',
        title: 'Bienvenido a Daily Quotes',
        subtitle: 'El lugar donde encontrarás el recordatorio de todas las frases de tus autores preferidos. Apreta el boton siguiente para descubrir todas las funcionalidades de la aplicacion antes de usarla',
        image: <Image source={require('../assets/1.png')} style={styles.image} />,
        titleStyles: styles.title,
        subTitleStyles: styles.subtitle,
      },
      {
        backgroundColor: '#f6f6f6',
        title: 'Recibe frases diarias de tu autor favorito',
        subtitle: 'Elige tu autor favorito y comienza a recibir notificaciones diarias con sus frases',
        image: <Image source={require('../assets/3.png')} style={styles.image} />,
        titleStyles: styles.title,
        subTitleStyles: styles.subtitle,
      },
      {
        backgroundColor: '#f6f6f6',
        title: 'Descubre, Comparte, Guarda',
        subtitle: 'Recibe inspiración diaria con citas de autores reconocidos y comparte tus frases favoritas con amigos o guárdalas para más tarde.',
        image: <Image source={require('../assets/2.png')} style={styles.image} />,
        titleStyles: styles.title,
        subTitleStyles: styles.subtitle,
      },
      {
        backgroundColor: '#f6f6f6',
        title: 'Biografias e informacion relevante',
        subtitle: 'Manteniendo apretado podras ver la biografia y datos de interes sobre tus autores preferidos, disfruta la experiencia DailyQuotes',
        image: <Image source={require('../assets/4.png')} style={styles.image} />,
        titleStyles: styles.title,
        subTitleStyles: styles.subtitle,
      },
    ]}
  />
);

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 50,
    color: '#333',
    fontFamily: 'Shibui',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontFamily: 'Neue',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    margin:3,
    fontFamily: "Neue",
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Neue",
  },
});

export default OnBoardingScreen;
