import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ImageBackground, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Imports de componentes y assets
import LoginForm from './src/views/login.js';
import Welcome from './src/views/welcome.js';
import logo from './src/assets/logo.png';
import fondo from './src/assets/fondo.png';

// Inicialización de navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Componente para la navegación con Tabs (para usar después de iniciar sesión)
function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={Welcome} />
    </Tab.Navigator>
  );
}

// Componente para la pantalla con el fondo y logo
function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground source={fondo} style={styles.fondo}>
        <Image source={logo} style={styles.logo} />
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

// Componente principal App
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen 
          name="Welcome" 
          component={Welcome} 
          options={{ title: 'Bienvenido' }}
        />
        <Stack.Screen 
          name="LoginForm" 
          component={LoginForm} 
          options={{ title: 'Inicia Sesión' }}
        />
        <Stack.Screen 
          name="MainApp" 
          component={MainTabNavigator} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  fondo: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center'
  },
  logo: {
    resizeMode: 'contain',
    width: '70%',
    height: '30%',
    position: 'relative',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  }  
});