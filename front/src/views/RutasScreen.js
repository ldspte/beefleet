import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RutasScreen = () => {
  // Estado para manejar las rutas y modales
  const [rutas, setRutas] = useState([]);
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [rutaModalVisible, setRutaModalVisible] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Simular la obtención de datos de la API
  useEffect(() => {
    // En un caso real, esto sería una llamada a una API
    const obtenerRutas = async () => {
      try {
        // Simular un retraso de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos simulados de la base de datos
        const rutasData = [
          { id_ruta: '1', origen: 'Ciudad de México', destino: 'Guadalajara', distancia: '540 km', carga: 'Electrónicos' },
          { id_ruta: '2', origen: 'Monterrey', destino: 'Tijuana', distancia: '2,300 km', carga: 'Alimentos' },
          { id_ruta: '3', origen: 'Veracruz', destino: 'Mérida', distancia: '730 km', carga: 'Material de construcción' },
          { id_ruta: '4', origen: 'Puebla', destino: 'León', distancia: '420 km', carga: 'Textiles' },
          { id_ruta: '5', origen: 'Cancún', destino: 'Ciudad de México', distancia: '1,650 km', carga: 'Productos turísticos' },
        ];
        
        setRutas(rutasData);
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar rutas:', error);
        Alert.alert('Error', 'No se pudieron cargar las rutas. Intente más tarde.');
        setCargando(false);
      }
    };

    obtenerRutas();
  }, []);

  // Función para mostrar los detalles de la ruta
  const verDetallesRuta = (ruta) => {
    setRutaSeleccionada(ruta);
    setRutaModalVisible(true);
  };

  // Función para aceptar una ruta
  const aceptarRuta = (id) => {
    // Aquí iría la lógica para aceptar la ruta en el servidor
    Alert.alert(
      'Ruta aceptada',
      `Has aceptado la ruta #${id}. Se te notificará cuando esté lista la carga.`,
      [{ text: 'OK', onPress: () => setRutaModalVisible(false) }]
    );
  };

  // Función para rechazar una ruta
  const rechazarRuta = (id) => {
    // Aquí iría la lógica para rechazar la ruta en el servidor
    Alert.alert(
      'Confirmar rechazo',
      '¿Estás seguro que deseas rechazar esta ruta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Rechazar', 
          style: 'destructive',
          onPress: () => {
            // Simulamos la eliminación de la ruta de la lista
            setRutas(rutas.filter(ruta => ruta.id_ruta !== id));
            setRutaModalVisible(false);
            Alert.alert('Ruta rechazada', 'Has rechazado esta ruta correctamente.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>RUTAS ASIGNADAS</Text>
        </View>
        
        {/* Estado de carga */}
        {cargando ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando rutas disponibles...</Text>
          </View>
        ) : (
          <>
            {/* Si no hay rutas disponibles */}
            {rutas.length === 0 ? (
              <View style={styles.noRutasContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#999" />
                <Text style={styles.noRutasText}>No hay rutas disponibles en este momento</Text>
              </View>
            ) : (
              <>
                {/* Sección explicativa */}
                <View style={styles.infoSection}>
                  <Text style={styles.infoText}>
                    Aquí puedes ver todas las rutas que tienes asignadas. Selecciona una para ver más detalles o comenzar tu viaje.
                  </Text>
                </View>
                
                {/* Lista de rutas */}
                <View style={styles.rutasListContainer}>
                  <Text style={styles.rutasSectionTitle}>Rutas disponibles ({rutas.length})</Text>
                  
                  {rutas.map((ruta) => (
                    <TouchableOpacity 
                      key={ruta.id_ruta}
                      style={styles.rutaCard}
                      onPress={() => verDetallesRuta(ruta)}
                    >
                      <View style={styles.rutaCardHeader}>
                        <Text style={styles.rutaId}>Ruta #{ruta.id_ruta}</Text>
                        <View style={styles.rutaDistance}>
                          <Ionicons name="navigate" size={16} color="#FF9500" />
                          <Text style={styles.rutaDistanceText}>{ruta.distancia}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.rutaRoute}>
                        <View style={styles.rutaLocations}>
                          <View style={styles.locationItem}>
                            <View style={styles.originDot} />
                            <Text style={styles.locationText}>{ruta.origen}</Text>
                          </View>
                          <View style={styles.routeLine} />
                          <View style={styles.locationItem}>
                            <View style={styles.destinationDot} />
                            <Text style={styles.locationText}>{ruta.destino}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View style={styles.rutaCardFooter}>
                        <View style={styles.cargaContainer}>
                          <Ionicons name="cube-outline" size={18} color="#666" />
                          <Text style={styles.cargaText}>{ruta.carga}</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.verDetallesButton}
                          onPress={() => verDetallesRuta(ruta)}
                        >
                          <Text style={styles.verDetallesButtonText}>Ver detalles</Text>
                          <Ionicons name="chevron-forward" size={16} color="#4285F4" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </>
        )}
        
        {/* Botón para actualizar rutas */}
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={() => {
            setCargando(true);
            // Simular recarga
            setTimeout(() => {
              setCargando(false);
              Alert.alert('Actualizado', 'Rutas actualizadas correctamente');
            }, 1000);
          }}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.refreshButtonText}>Actualizar rutas</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Modal de detalles de ruta */}
      {rutaSeleccionada && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={rutaModalVisible}
          onRequestClose={() => setRutaModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Detalles de la Ruta</Text>
                <TouchableOpacity onPress={() => setRutaModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.rutaDetailCard}>
                <Text style={styles.rutaDetailId}>Ruta #{rutaSeleccionada.id_ruta}</Text>
                
                <View style={styles.rutaDetailSection}>
                  <Text style={styles.rutaDetailLabel}>Origen:</Text>
                  <View style={styles.rutaDetailValue}>
                    <Ionicons name="location" size={18} color="#4CAF50" />
                    <Text style={styles.rutaDetailValueText}>{rutaSeleccionada.origen}</Text>
                  </View>
                </View>
                
                <View style={styles.rutaDetailSection}>
                  <Text style={styles.rutaDetailLabel}>Destino:</Text>
                  <View style={styles.rutaDetailValue}>
                    <Ionicons name="location" size={18} color="#FF9500" />
                    <Text style={styles.rutaDetailValueText}>{rutaSeleccionada.destino}</Text>
                  </View>
                </View>
                
                <View style={styles.rutaDetailSection}>
                  <Text style={styles.rutaDetailLabel}>Distancia:</Text>
                  <View style={styles.rutaDetailValue}>
                    <Ionicons name="speedometer" size={18} color="#4285F4" />
                    <Text style={styles.rutaDetailValueText}>{rutaSeleccionada.distancia}</Text>
                  </View>
                </View>
                
                <View style={styles.rutaDetailSection}>
                  <Text style={styles.rutaDetailLabel}>Carga:</Text>
                  <View style={styles.rutaDetailValue}>
                    <Ionicons name="cube" size={18} color="#9C27B0" />
                    <Text style={styles.rutaDetailValueText}>{rutaSeleccionada.carga}</Text>
                  </View>
                </View>
                
                <View style={styles.rutaDetailSection}>
                  <Text style={styles.rutaDetailLabel}>Tiempo estimado:</Text>
                  <View style={styles.rutaDetailValue}>
                    <Ionicons name="time" size={18} color="#FFC107" />
                    <Text style={styles.rutaDetailValueText}>
                      {parseInt(rutaSeleccionada.distancia) > 1000 ? 
                        Math.ceil(parseInt(rutaSeleccionada.distancia.replace(/[^\d]/g, '')) / 80) + ' días' : 
                        Math.ceil(parseInt(rutaSeleccionada.distancia.replace(/[^\d]/g, '')) / 80) + ' horas'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.rutaActionButtons}>
                <TouchableOpacity 
                  style={styles.rechazarButton}
                  onPress={() => rechazarRuta(rutaSeleccionada.id_ruta)}
                >
                  <Text style={styles.rechazarButtonText}>Rechazar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.aceptarButton}
                  onPress={() => aceptarRuta(rutaSeleccionada.id_ruta)}
                >
                  <Text style={styles.aceptarButtonText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.iniciarRutaButton}
                onPress={() => {
                  setRutaModalVisible(false);
                  Alert.alert('Ruta iniciada', `Has iniciado la ruta hacia ${rutaSeleccionada.destino}. ¡Buen viaje!`);
                }}
              >
                <Ionicons name="navigate" size={20} color="#fff" />
                <Text style={styles.iniciarRutaButtonText}>INICIAR RUTA</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  noRutasContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noRutasText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  rutasListContainer: {
    marginBottom: 20,
  },
  rutasSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  rutaCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rutaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rutaId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rutaDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rutaDistanceText: {
    fontSize: 14,
    color: '#FF9500',
    marginLeft: 4,
    fontWeight: '500',
  },
  rutaRoute: {
    marginBottom: 12,
  },
  rutaLocations: {
    position: 'relative',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  destinationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF9500',
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
  },
  routeLine: {
    position: 'absolute',
    left: 5.5,
    top: 12,
    bottom: 12,
    width: 1,
    backgroundColor: '#ccc',
    zIndex: -1,
  },
  rutaCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cargaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cargaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  verDetallesButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verDetallesButtonText: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '500',
    marginRight: 4,
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: '#FB8500',
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  rutaDetailCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  rutaDetailId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  rutaDetailSection: {
    marginBottom: 12,
  },
  rutaDetailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rutaDetailValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rutaDetailValueText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginLeft: 6,
  },
  rutaActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  rechazarButton: {
    flex: 0.48,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  rechazarButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  aceptarButton: {
    flex: 0.48,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
  },
  aceptarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  iniciarRutaButton: {
    flexDirection: 'row',
    backgroundColor: '#FF9500',
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  iniciarRutaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default RutasScreen;