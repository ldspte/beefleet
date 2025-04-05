import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const ConduUser = () => {
  return (
    <ScrollView style={styles.scroll}> 
      <View style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={require('../assets/user.png')} 
            style={styles.profileImage}
          />
          <Text style={styles.name}>Nombre del Conductor</Text>
          <Text style={styles.subtitle}>Conductor Activo</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Documento:</Text>
            <Text style={styles.infoValue}>123456789</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>conductor@ejemplo.com</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Teléfono:</Text>
            <Text style={styles.infoValue}>+52 123 456 7890</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dirección:</Text>
            <Text style={styles.infoValue}>Carrera #3 (Marinilla - Antioquia)</Text>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información Laboral</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Número de Licencia:</Text>
            <Text style={styles.infoValue}>c2</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha de vencimiento:</Text>
            <Text style={styles.infoValue}>25/05/25</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Notificaciones</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>352</Text>
              <Text style={styles.statLabel}>Viajes</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>2 años</Text>
              <Text style={styles.statLabel}>Experiencia</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    backgroundColor: '#e1e1e1',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    flex: 2,
    fontSize: 16,
  },
  statsSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scroll: {
    height: 580,
  }
});

export default ConduUser;