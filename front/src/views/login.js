import React from "react";
import { StyleSheet, View , Text, TextInput, Button , Alert } from "react-native";
import { useState } from "react";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email && password) {
            Alert.alert('Ingreso exitoso');
        }else{
            Alert.alert('Error en el ingreso');
        }
    }
    return(
        <View>
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
                <Button title="Iniciar Sesión" onPress={handleLogin} /> 
        </View>
    )
}
export default LoginForm;



const styles = StyleSheet.create({
    title:{
        fontSize: 30,
        marginBottom: 20,
        color: '#000'
    },
    input:{
        backgroundColor: '#fff',
        width: '90%',
        height:'10%',
        marginBottom: 20,
        padding: 10,
        borderRadius: 10
    }
})