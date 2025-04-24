import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Welcome = ({ navigation }) => {
    return (
      <ImageBackground
        source={require('../assets/fondo.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <View style={styles.logoGlow} />
            </View>
            
            <Text style={styles.title}>¡BIENVENIDO!</Text>
            <Text style={styles.subtitle}>Es un gusto verte de nuevo</Text>
            
            <TouchableOpacity 
              style={styles.buttonContainer}
              onPress={() => navigation.navigate('LoginForm')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF9500', '#FB8500', '#F77F00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Comenzar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    width: 180,  
    height: 180,
  },
  logoGlow: {
    position: 'absolute',
    height: 80,
    backgroundColor: 'rgba(255, 133, 0, 0.3)',
    borderRadius: 40,
    bottom: -15,
    transform: [{ scaleX: 1.2 }],
    zIndex: -1,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 22,
    color: 'white',
    marginBottom: 50,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '80%',
    maxWidth: 280,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
});

export default Welcome;