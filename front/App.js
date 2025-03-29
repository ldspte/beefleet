import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Imports de pantallas
import LoginForm from './src/views/login.js';
import Welcome from './src/views/welcome.js';
import RecuperarContrasena from './src/views/recuperarContrasena.js';
import ConduUser from './src/views/conduUser.js';//

// Inicialización de navegadores
const Stack = createStackNavigator();


// Componente principal App
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
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
          name="ConduUser"
          component={ConduUser}
          options={{ title:'Perfil Conductor' }}
        />
        <Stack.Screen 
          name="RecuperarContrasena" 
          component={RecuperarContrasena} 
          options={{ title: 'Recuperar Contraseña' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

