import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Alert, TouchableOpacity, Image, ImageBackground } from "react-native";
import { useNavigation } from '@react-navigation/native';

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
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPassword}>¿Olvidaste la contraseña?</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                        style={styles.button}
                        onPress={() => navigation.navigate('')}
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
    logoContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    logo: {
        width: 150,  // Ajusta según el tamaño deseado
        height: 150, // Ajusta según el tamaño deseado
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'white',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    forgotPassword: {
        color: '#3498db',
        textAlign: 'right',
        marginBottom: 20,
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

export default LoginForm;