import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener esta dependencia instalada

export default function Notifications() {
  // Datos de ejemplo para las notificaciones
  const notificationsData = [
    {
      id: '1',
      title: 'Nuevo viaje asignado',
      message: 'Se te ha asignado el viaje #4567 para mañana a las 8:00 AM.',
      time: 'Hace 10 minutos',
      read: false,
      type: 'assignment'
    },
    {
      id: '2',
      title: 'Recordatorio de mantenimiento',
      message: 'Tu vehículo tiene mantenimiento programado para el 10 de abril.',
      time: 'Hace 2 horas',
      read: false,
      type: 'maintenance'
    },
    {
      id: '3',
      title: 'Cambio de horario',
      message: 'El viaje #3421 ha sido reprogramado para las 14:00.',
      time: 'Ayer',
      read: true,
      type: 'schedule'
    },
    {
      id: '4',
      title: 'Actualización de sistema',
      message: 'Nueva versión de la aplicación disponible. Por favor actualiza cuando sea posible.',
      time: '2 días atrás',
      read: true,
      type: 'system'
    },
    {
      id: '5',
      title: 'Felicitaciones',
      message: 'Has completado 10 viajes este mes. ¡Sigue así!',
      time: '5 días atrás',
      read: true,
      type: 'achievement'
    }
  ];

  // Función para renderizar cada notificación
  const renderNotificationItem = ({ item }) => {
    // Seleccionar el icono según el tipo de notificación
    let iconName;
    let iconColor;
    
    switch (item.type) {
      case 'assignment':
        iconName = 'car';
        iconColor = '#007BFF';
        break;
      case 'maintenance':
        iconName = 'construct';
        iconColor = '#FF9500';
        break;
      case 'schedule':
        iconName = 'calendar';
        iconColor = '#5856D6';
        break;
      case 'system':
        iconName = 'phone-portrait';
        iconColor = '#34C759';
        break;
      case 'achievement':
        iconName = 'trophy';
        iconColor = '#FFCC00';
        break;
      default:
        iconName = 'notifications';
        iconColor = '#8E8E93';
    }

    return (
      <TouchableOpacity 
        style={[
          styles.notificationItem, 
          item.read ? styles.readNotification : styles.unreadNotification
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <TouchableOpacity style={styles.markAllButton}>
          <Text style={styles.markAllText}>Marcar todas como leídas</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={notificationsData}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    color: '#007BFF',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#007BFF',
  },
  readNotification: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    marginLeft: 8,
  },
});