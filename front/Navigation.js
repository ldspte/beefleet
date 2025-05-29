import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
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
import ReportesScreen from './src/views/ReportesScreen.js';
import RutasScreen from './src/views/RutasScreen.js';
import TruckDriverView from './src/views/TruckDriverView.js';

// Inicialización de navegadores
const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ReportesStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const TruckStack = createStackNavigator();
const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TruckStackScreen() {
  return (
    <TruckStack.Navigator>
      <TruckStack.Screen
        name="ReportesScreen"
        component={ReportesScreen}
        options={{ title: 'ReportesScreen' }} 
      />
    </TruckStack.Navigator>
  );
}

// Stack Navigator para Home
function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="HomeScreen" 
        component={Home} 
        options={{ headerShown: false }} 
      />
      <HomeStack.Screen 
        name="RutasScreen" 
        component={RutasScreen} 
        options={{ title: 'Rutas' }} 
      />
      <HomeStack.Screen 
        name="TruckDriverView" 
        component={TruckDriverView} 
        options={{ title: 'Vehículo' }} 
      />
    </HomeStack.Navigator>
  );
}

// Stack Navigator para Reportes
function ReportesStackScreen() {
  return (
    <ReportesStack.Navigator>
      <ReportesStack.Screen 
        name="ReportesScreen" 
        component={ReportesScreen} 
        options={{ headerShown: false }} 
      />
    </ReportesStack.Navigator>
  );
}

// Stack Navigator para Profile
function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="ProfileScreen" 
        component={ConduUser} 
        options={{ headerShown: false }} 
      />
    </ProfileStack.Navigator>
  );
}

// Bottom Tab Navigator (visible después del login)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          // Usar los nombres correctos de las rutas
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Reportes') {
            iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FB8500',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen 
        name="Inicio" 
        component={HomeStackScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Reportes" 
        component={ReportesStackScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileStackScreen} 
        options={{ headerShown: false }} 
      />
    </Tab.Navigator>
  );
}

// Stack de autenticación
function AuthStackScreen() {
  return (
    <AuthStack.Navigator initialRouteName="Welcome">
      <AuthStack.Screen 
        name="Welcome" 
        component={Welcome} 
        options={{ headerShown: false }} 
      />
      <AuthStack.Screen 
        name="LoginForm" 
        component={LoginForm} 
        options={{ title: 'Iniciar Sesión' }} 
      />
      <AuthStack.Screen 
        name="RecuperarContrasena" 
        component={RecuperarContrasena} 
        options={{ title: 'Recuperar Contraseña' }} 
      />
    </AuthStack.Navigator>
  );
}

// Stack Navigator principal
const Navigation = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Auth" component={AuthStackScreen} />
      <RootStack.Screen name="MainApp" component={MainTabs} />
    </RootStack.Navigator>
  );
};

export default Navigation;