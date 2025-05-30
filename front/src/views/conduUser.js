import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConduUser = ({ navigation }) => {
  const [driverInfo, setDriverInfo] = useState({
    tipo_documento: '',
    documento: '',
    nombre_conductor: '',
    apellido_conductor: '',
    correo_conductor: '',
    foto: '',
    telefono: '',
    ciudad: '',
    direccion: '',
    tipo_licencia: '',
    fecha_vencimiento: '',
    experiencia: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const driverId = await AsyncStorage.getItem('id_conductor');
        console.log(driverId);
        const response = await fetch(`http://localhost:3001/api/drivers/${driverId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setDriverInfo(data);
        } else {
          Alert.alert('Error', 'No se pudo obtener la información del usuario.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Hubo un problema al obtener la información del usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FB8500" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: driverInfo.foto || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <View style={styles.statusIndicator} />
          </View>
          <Text style={styles.headerTitle}>
            {driverInfo[0]?.nombre_conductor} {driverInfo[0]?.apellido_conductor}
          </Text>
          <Text style={styles.headerSubtitle}>Conductor Activo</Text>
        </View>

        {/* Estadísticas Cards */}
        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Ionicons name="notifications-outline" size={32} color="#FB8500" />
            <Text style={styles.cardTitle}>Notificaciones</Text>
            <Text style={styles.cardCount}>5</Text>
          </View>
          
          <View style={styles.card}>
            <Ionicons name="car-outline" size={32} color="#FB8500" />
            <Text style={styles.cardTitle}>Viajes</Text>
            <Text style={styles.cardCount}>352</Text>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Ionicons name="time-outline" size={32} color="#FB8500" />
            <Text style={styles.cardTitle}>Experiencia</Text>
            <Text style={styles.cardCount}>{driverInfo[0]?.experiencia} años</Text>
          </View>
          
          <View style={styles.card}>
            <Ionicons name="checkmark-circle-outline" size={32} color="#FB8500" />
            <Text style={styles.cardTitle}>Estado</Text>
            <Text style={styles.cardCount}>Activo</Text>
          </View>
        </View>

        {/* Información Personal */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="card-outline" size={20} color="#fca311" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Documento</Text>
              <Text style={styles.infoValue}>{driverInfo[0]?.documento}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={20} color="#fca311" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{driverInfo[0]?.correo_conductor}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={20} color="#fca311" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{driverInfo[0]?.telefono}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={20} color="#fca311" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Dirección</Text>
              <Text style={styles.infoValue}>{driverInfo[0]?.direccion}</Text>
            </View>
          </View>
        </View>

        {/* Información Laboral */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información Laboral</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="id-card-outline" size={20} color="#fca311" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Tipo de Licencia</Text>
              <Text style={styles.infoValue}>{driverInfo[0]?.tipo_licencia}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#fca311" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Fecha de Vencimiento</Text>
              <Text style={styles.infoValue}>{driverInfo[0]?.fecha_vencimiento}</Text>
            </View>
          </View>
        </View>

        {/* Botón de cerrar sesión */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#333',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e1e1e1',
    borderWidth: 3,
    borderColor: '#FB8500',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FB8500',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
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
    textAlign: 'center',
  },
  cardCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2f02',
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: '#dc2f02',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ConduUser;