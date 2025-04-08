import React from "react";
import { StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, ImageBackground } from "react-native";
import * as Asset from "expo-asset"; // Para precargar la imagen

const recuperarContrasena = ({navigation}) => {

        return(
            <ImageBackground 
            source={require('../assets/fondo.png')}
            style={styles.backgroundImage}
            >

         <View style={styles.container}>
                <Text style={styles.title}>Recuperar Contraseña</Text>
                <Text style={styles.subtitle}>Ingresa tu correo para recibir un enlace de recuperación</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="white"
                    keyboardType="email-address"
                />

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
        ); 
};
    //const [email, setEmail] = useState('');//

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
            backgroundColor: 'rgba(0,0,0,0.3)',
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 10,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            color: 'white',
            marginBottom: 20,
            textAlign: 'center',
        },
        input: {
            height: 200,
            width: 300,
            height: 50,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            borderRadius: 10,
            paddingHorizontal: 15,
            marginBottom: 20,
        },
        button: {
            backgroundColor: '#FB8500',
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 25,
            marginTop: 10,
        },
        buttonText: {
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
        },
        backButton: {
            marginTop: 15,
        },
        backButtonText: {
            color: 'white',
            fontSize: 16,
            textDecorationLine: 'underline',
        },
    });
    
    export default recuperarContrasena; 
    