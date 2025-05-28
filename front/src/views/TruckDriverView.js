import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const TruckDriverView = ({ conductorId = 1 }) => {
  const navigation = useNavigation();
  const [truckData, setTruckData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Función para obtener los datos del camión desde la base de datos
  const fetchTruckData = async () => {
    try {
      // Aquí harías la consulta a tu base de datos
      // Por ejemplo: const response = await fetch(`/api/vehiculo/conductor/${conductorId}`);
      
      // Simulando datos de la base de datos basados en tu tabla
      const mockData = {
        id_vehiculo: 1,
        placa: 'ABC123',
        modelo: '2014',
        peso: 590,
        matricula: '1234567',
        seguro: 'car',
        estado_vehiculo: 1,
        conductor: 1
      };
      
      setTruckData(mockData);
    } catch (error) {
      console.error('Error al obtener datos del camión:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos del camión');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTruckData();
  }, [conductorId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTruckData();
  };

  const getEstadoVehiculo = (estado) => {
    switch (estado) {
      case 1:
        return { text: 'Activo', color: '#4CAF50', icon: 'check-circle' };
      case 0:
        return { text: 'Inactivo', color: '#F44336', icon: 'cancel' };
      default:
        return { text: 'Desconocido', color: '#9E9E9E', icon: 'help' };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Cargando información del camión...</Text>
      </View>
    );
  }

  if (!truckData) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error-outline" size={48} color="#F44336" />
        <Text style={styles.errorTitle}>No hay camión asignado</Text>
        <Text style={styles.errorSubtitle}>
          No se encontró un camión asignado a este conductor
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTruckData}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const estadoInfo = getEstadoVehiculo(truckData.estado_vehiculo);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Icon name="local-shipping" size={40} color="#FB8500" />
        <Text style={styles.headerTitle}>Mi Camión</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Información del Vehículo</Text>
          <View style={[styles.statusBadge, { backgroundColor: estadoInfo.color }]}>
            <Icon name={estadoInfo.icon} size={16} color="white" />
            <Text style={styles.statusText}>{estadoInfo.text}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <Icon name="confirmation-number" size={20} color="#666" />
              <Text style={styles.infoLabel}>ID Vehículo</Text>
            </View>
            <Text style={styles.infoValue}>{truckData.id_vehiculo}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <Icon name="credit-card" size={20} color="#666" />
              <Text style={styles.infoLabel}>Placa</Text>
            </View>
            <Text style={styles.infoValue}>{truckData.placa}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <Icon name="calendar-today" size={20} color="#666" />
              <Text style={styles.infoLabel}>Modelo</Text>
            </View>
            <Text style={styles.infoValue}>{truckData.modelo}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <Icon name="monitor-weight" size={20} color="#666" />
              <Text style={styles.infoLabel}>Peso (kg)</Text>
            </View>
            <Text style={styles.infoValue}>{truckData.peso.toLocaleString()}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <Icon name="description" size={20} color="#666" />
              <Text style={styles.infoLabel}>Matrícula</Text>
            </View>
            <Text style={styles.infoValue}>{truckData.matricula}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoHeader}>
              <Icon name="security" size={20} color="#666" />
              <Text style={styles.infoLabel}>Seguro</Text>
            </View>
            <Text style={styles.infoValue}>{truckData.seguro}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
         style={styles.primaryButton} 
         onPress={() => navigation.navigate('ReportesScreen')}
        >
          <Icon name="report-problem" size={20} color="white" />
          <Text style={styles.primaryButtonText}>Reportar Problema</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Funcionalidad', 'Ver historial')}>
          <Icon name="history" size={20} color="#2196F3" />
          <Text style={styles.secondaryButtonText}>Ver Historial</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginLeft: 28,
  },
  actionButtons: {
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#FF9800',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2196F3',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TruckDriverView;