import { StatusBar } from 'expo-status-bar';
import { ImageBackground, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Imports de componentes y assets
import LoginForm from './src/views/login.js';
import Welcome from './src/views/welcome.js';
import recuperarContrasena from './src/views/recuperarContrasena.js';
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
          name="recuperarContrasena" 
          component={recuperarContrasena} 
          options={{ title: 'Recuperar Contraseña' }}
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

