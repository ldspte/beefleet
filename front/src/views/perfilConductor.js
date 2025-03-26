import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native"; //permite cambiar la pantalla cuando se presionen los botones
const PerfilConductor = () => {
    return (
      <ImageBackground source={require("../assets/fondo.png")} style={styles.backgroundImage}>
        <View style={styles.container}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <Text style={styles.title}>Bienvenido, Conductor</Text>
          <Text style={styles.subtitle}>¿Qué quieres hacer hoy?</Text>
  
          <View style={styles.grid}>
            <TouchableOpacity style={styles.card}><Text style={styles.cardText}>📩 Notificaciones</Text></TouchableOpacity>
            <TouchableOpacity style={styles.card}><Text style={styles.cardText}>🚚 Tu vehículo</Text></TouchableOpacity>
            <TouchableOpacity style={styles.card}><Text style={styles.cardText}>🗺️ Rutas</Text></TouchableOpacity>
            <TouchableOpacity style={styles.card}><Text style={styles.cardText}>📦 Cargas</Text></TouchableOpacity>
            <TouchableOpacity style={styles.card}><Text style={styles.cardText}>💰 Ingresos</Text></TouchableOpacity>
            <TouchableOpacity style={styles.card}><Text style={styles.cardText}>💸 Gastos</Text></TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  };
  
  const styles = {
    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
    },
    container: {
      alignItems: "center",
      padding: 20,
    },
    logo: {
      width: 150,
      height: 100,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
    },
    subtitle: {
      fontSize: 16,
      color: "#fff",
      marginBottom: 20,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    card: {
      backgroundColor: "#FFA54F",
      padding: 15,
      borderRadius: 10,
      margin: 10,
    },
    cardText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#fff",
    },
  };
  
  export default PerfilConductor;