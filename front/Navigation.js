import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Imports de pantallas de autenticación
import LoginForm from './src/views/LoginForm.js';
import Welcome from './src/views/welcome.js';
import RecuperarContrasena from './src/views/recuperarContrasena.js';

// Imports de pantallas principales (post-login)
import ConduUser from './src/views/conduUser.js';
import Home from './src/views/Home.js'; 
import Notifications from './src/views/Notifications.js'; 

// Inicialización de navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator (visible después del login)
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={Notifications} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ConduUser} 
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator principal
const Navigation = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      {/* Pantallas de autenticación */}
      <Stack.Screen 
        name="Welcome" 
        component={Welcome} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="LoginForm" 
        component={LoginForm} 
        options={{ title: 'Iniciar Sesión' }}
      />
      <Stack.Screen 
        name="RecuperarContrasena" 
        component={RecuperarContrasena} 
        options={{ title: 'Recuperar Contraseña' }}
      />
      
      <Stack.Screen
        name="ConduUser"
        component={ConduUser}
        options={{ title: 'Perfil Conductor' }}
      />
      <Stack.Screen 
        name="MainApp" 
        component={BottomTabNavigator} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Navigation;