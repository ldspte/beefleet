import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bienvenido </Text>
          <Text style={styles.headerSubtitle}>Sistema de Camiones</Text>
        </View>
        
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card}>
            <Ionicons name="car-outline" size={40} color="#FB8500" />
            <Text style={styles.cardTitle}>Tu Vehículo</Text>
            <Text style={styles.cardCount}>ABC 123</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.card}>
            <Ionicons name="navigate-circle-outline" size={40} color="#FB8500" />
            <Text style={styles.cardTitle}>Tus Viajes</Text>
            <Text style={styles.cardCount}>Ver</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card}>
            <Ionicons name="checkmark-circle-outline" size={40} color="#FB8500" />
            <Text style={styles.cardTitle}>Completados</Text>
            <Text style={styles.cardCount}>12</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.card}>
            <Ionicons name="analytics-outline" size={40} color="#FB8500" />
            <Text style={styles.cardTitle}>Estadísticas</Text>
            <Text style={styles.cardCount}>Ver</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          
          <View style={styles.activityItem}>
            <Ionicons name="time-outline" size={20} color="#fca311" />
            <Text style={styles.activityText}>Viaje #1234 completado</Text>
          </View>
          
          <View style={styles.activityItem}>
            <Ionicons name="time-outline" size={20} color="#fca311" />
            <Text style={styles.activityText}>Nuevo viaje asignado #4567</Text>
          </View>
          
          <View style={styles.activityItem}>
            <Ionicons name="time-outline" size={20} color="#fca311" />
            <Text style={styles.activityText}>Mantenimiento programado</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    color: '#333',
  },
  cardCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2f02',
    marginTop: 4,
  },
  recentActivity: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activityText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },
});

export default Home;