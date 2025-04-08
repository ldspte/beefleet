import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, Image } from 'react-native';
import * as Asset from "expo-asset"; // Para precargar la imagen
const Welcome = ({ navigation }) => {
    return (
      <ImageBackground
      source={require('../assets/fondo.png')}
      style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>¡Gracias por usar nuestra aplicación!</Text>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('LoginForm')}
          >
            <Text style={styles.buttonText}>Comenzar</Text>
          </TouchableOpacity>
        </View>
    </ImageBackground>
    );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // Esto añade un overlay oscuro sobre la imagen
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 150,  // Ajusta según el tamaño deseado
    height: 150, // Ajusta según el tamaño deseado
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FB8500',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Welcome;