import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";


const recuperarContrasena = () => {
    const [email, setEmail] = useState('');

    const handleRecuperacion = () => {
        if (email) {
            Alert.alert('Recuperación en proceso', 'Se ha enviado un enlace a tu correo para recuperar la contraseña.');
            // Aquí iría tu lógica de recuperación
        } else {
            Alert.alert('Error', 'Por favor ingresa un correo válido');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <Text style={styles.subtitle}>Ingresa tu correo electrónico para recibir una nueva contraseña</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Button title="Enviar" onPress={handleRecuperacion} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});

export default recuperarContrasena;