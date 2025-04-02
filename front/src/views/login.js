import React from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import { useState } from "react";
import axios from "axios";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async () => {
        try{
            if (email && password) {
                Alert.alert('Ingreso exitoso');
            }

        } catch (error) {
            console.error(error);
            Alert.alert('Error en el ingreso');
        }
        
    

    return (
        <View style={styles.container}>
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
            <Button style={styles.button} title="Iniciar Sesión" onPress={handleLogin} />
        </View>
    )
}
}
export default LoginForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 30,
        marginBottom: 20,
        color: '#fff'
    },
    input: {
        backgroundColor: '#fff',
        width: 300, 
        height: 50, 
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        borderColor: '#ccc', // borde para mejor visualización
        borderWidth: 1, // borde para mejor visualización
    },
    button: {
        backgroundColor:'#ffb703',
        color:'#ffb703',
        width: 300
    }
});