import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, Image, ImageBackground} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginForm = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleRecuperarContraseña = () => {
        console.log('Navegando a RecuperarPassword')
        navigation.navigate('RecuperarContrasena'); // Navegar a la pantalla de recuperación
    }
    const handleLogin = async () => {
        console.log(email, password);
        if (email && password) {
            try {
                const response = await fetch('http://localhost:3001/api/logindrivers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        correo_conductor: email,
                        contraseña: password,
                    }),
                });
    
                const data = await response.json(); // Procesa la respuesta como JSON
                if (response.ok) {
                    await AsyncStorage.setItem('token', data.token);
                    await AsyncStorage.setItem('id_conductor', data.user[0].id_conductor); // Asegúrate de que id_conductor sea un string
                    Alert.alert('Inicio de sesión exitoso');
                    navigation.navigate('MainApp');
                } else {
                    Alert.alert('Error', data.message || 'Credenciales incorrectas');
                }
            } catch (error) {
                console.error('Error during login:', error);
                Alert.alert('Correo Electronico o Contraseña Invalidos');
            }
        } else {
            Alert.alert('Por favor, Completa todos los campos');
        }
    };
    
    return(
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
                <Text style={styles.title}>Iniciar Sesión</Text>
                <TextInput
                    style={[styles.input, styles.webInput]}
                    Updated upstream
                    placeholder="Correo electrónico"
                    placeholderTextColor="white"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={[styles.input, styles.webInput]}
                    placeholder="Contraseña"
                    placeholderTextColor="white"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity onPress={handleRecuperarContraseña} style={styles.forgotContainer}>
                    <Text style={styles.forgotPassword}>¿Olvidaste la contraseña?</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button]}
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>Ingresa</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
    },
    webContainer: {
        maxWidth: '100%',
        alignItems: 'center',
        marginBottom: 50,
    },
    logoContainer: {
        marginBottom: 40,
        alignItems: 'center'
    },
    logo: {
        width: 150,
        height: 150,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    input: {
        width: 300,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        borderRadius: 10,
        paddingHorizontal: 15
    },
    webInput: {
        width: 340,
        alignSelf: 'center',
        marginBottom: 20,
    },
    forgotContainer: {
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
    },
    forgotPassword: {
        color: 'white',
        textAlign: 'right',
        marginBottom: 20,
    },
    button: {
        width: 270,
        height: 50,
        backgroundColor: '#FB8500',
        paddingVertical: 12,
        paddingHorizontal: 70,
        borderRadius: 25,
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    webButton: {
        width: 270,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default LoginForm;