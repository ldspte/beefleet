import React, { useState } from "react";
import { 
    StyleSheet, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    ImageBackground, 
    Alert,
    ActivityIndicator 
} from "react-native";

const RecuperarContrasena = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEnviarRecuperacion = async () => {
        // Validar que el email no esté vacío
        if (!email.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert('Error', 'Por favor ingresa un correo válido');
            return;
        }

        try {
            setLoading(true);
            
            // Cambia esta URL por tu IP local o la que uses
            // Para emulador Android: http://10.0.2.2:3001
            // Para dispositivo físico: http://TU_IP_LOCAL:3001
            const API_URL = 'http://192.168.28.115:3001'; // Cambia por tu IP
            
            const response = await fetch(`http://localhost:3001/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email.toLowerCase().trim() 
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Alert.alert(
                    'Correo enviado',
                    'Revisa tu bandeja de entrada para restablecer tu contraseña. También revisa la carpeta de spam.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Limpiar el campo y regresar
                                setEmail('');
                                if (navigation) {
                                    navigation.goBack();
                                }
                            }
                        }
                    ]
                );
            } else {
                Alert.alert(
                    'Error', 
                    data.message || 'No se pudo enviar el correo. Intenta nuevamente.'
                );
            }

        } catch (error) {
            console.error('Error al enviar recuperación:', error);
            Alert.alert(
                'Error de conexión', 
                'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/fondo.png')}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Recuperar Contraseña</Text>
                <Text style={styles.subtitle}>
                    Ingresa tu correo para recibir un enlace de recuperación
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="rgba(255, 255, 255, 0.7)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                />

                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleEnviarRecuperacion}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Enviar</Text>
                    )}
                </TouchableOpacity>

                {/* Botón para regresar */}
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation && navigation.goBack()}
                    disabled={loading}
                >
                    <Text style={styles.backButtonText}>
                        Volver al inicio de sesión
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

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
        marginBottom: 30,
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 22,
    },
    input: {
        width: 300,
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    button: {
        backgroundColor: '#FB8500',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 10,
        minWidth: 120,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: 'rgba(251, 133, 0, 0.6)',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 20,
        paddingVertical: 10,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default RecuperarContrasena;