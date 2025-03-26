import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, Image, ImageBackground, Platform, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import * as Asset from "expo-asset"; // Para precargar la imagen

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    
    const handleForgotPassword = () => {
        navigation.navigate('recuperarContrasena'); // Navegar a la pantalla de recuperación
    }
    
    const handleLogin = () => {
        if (email && password) {
            Alert.alert('Ingreso exitoso');
        } else {
            Alert.alert('Error en el ingreso');
        }
    }
    
    const isWeb = Platform.OS === 'web';
    const windowWidth = Dimensions.get('window').width;
    
    return(
        <ImageBackground 
        source={require('../assets/fondo.png')}
        style={styles.backgroundImage}
        >
            <View style={[styles.container, isWeb && styles.webContainer]}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.title}>Iniciar Sesión</Text>
                <TextInput
                    style={[styles.input, isWeb && styles.webInput]}
                    Updated upstream
                    placeholder="Email"
                    placeholder="Correo electrónico"
                    placeholderTextColor="white"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={[styles.input, isWeb && styles.webInput]}
                    placeholder="Contraseña"
                    placeholderTextColor="white"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotContainer}>
                    <Text style={styles.forgotPassword}>¿Olvidaste la contraseña?</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, isWeb && styles.webButton]}
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

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
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
    },
    webContainer: {
        maxWidth: '100%',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 40,
        alignItems: 'center',
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
    },
    input: {
        width: 340,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        maxWidth: '100%',

        height: 200,
        width: 300,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    webInput: {
        width: 340,
        alignSelf: 'center',
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