import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Linking,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReportesScreen = () => {
  // Estados para manejar las diferentes funcionalidades
  const [reportType , setReportType] = useState('');
  // Define reportTypeOptions como un array para usarlo con .map()
  const reportTypeOptions = ['Falla mecánica', 'Retraso', 'Accidente', 'Problema de carga', 'Carga completada', 'En viaje', 'Descarga completada', 'Otro'];
  const [showReportTypeDropdown, setShowReportTypeDropdown] = useState(false);
  const [etapaActual, setEtapaActual] = useState('');
  const [estadoCarga, setEstadoCarga] = useState('');
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  
  // Función para abrir la cámara
  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso requerido', 'Necesitas dar permiso para acceder a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
    
    setImageModalVisible(false);
  };

  // Función para abrir la galería
  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permiso requerido', 'Necesitas dar permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedImages([...selectedImages, ...newImages]);
    }
    
    setImageModalVisible(false);
  };

  // Función para enviar el reporte
  const handleSendReport = () => {
    // Aquí iría la lógica para enviar el reporte a un servidor
    // Por ahora solo mostramos el mensaje de confirmación
    setReportSent(true);
    
    // Opcional: Reset del estado después de algunos segundos
    setTimeout(() => {
      setReportSent(false);
      setReportType('');
      setSelectedImages([]);
      // Resetear otros campos si es necesario
    }, 3000);
  };
  const callNumber = (number) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    
    Linking.openURL(phoneNumber)
      .catch(err => console.error('Error al intentar llamar:', err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Agregar Reporte Section */}
        <View style={styles.reportSection}>
          <Text style={styles.reportSectionTitle}>Agregar reporte</Text>
          
          <Text style={styles.descriptionText}>
            Describe el problema o irregularidad (ej. retrasos, fallas del vehículo, accidentes, etc.)
          </Text>
          
          {/* Dropdown para Tipo de Reporte */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowReportTypeDropdown(!showReportTypeDropdown)}
            >
              <Text style={styles.dropdownButtonText}>
                {reportType || 'Tipo de reporte'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            
            {/* Dropdown menu - Corregido para usar reportTypeOptions en lugar de reportType */}
            {showReportTypeDropdown && (
              <View style={styles.dropdownMenu}>
                {reportTypeOptions.map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setReportType(type);
                      setShowReportTypeDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          {/* Campo de texto para el reporte */}
          <TextInput
            style={styles.reportInput}
            placeholder="Problema con el vehículo"
            multiline
            numberOfLines={3}
          />
          
          {/* Botones para agregar foto y ubicación */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setImageModalVisible(true)}
            >
              <Ionicons name="camera-outline" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Agregar imágenes</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="location-outline" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Ubicación del incidente</Text>
            </TouchableOpacity>
          </View>
          
          {/* Vista previa de imágenes seleccionadas */}
          {selectedImages.length > 0 && (
            <View style={styles.selectedImagesContainer}>
              <Text style={styles.selectedImagesText}>
                {selectedImages.length} {selectedImages.length === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}
              </Text>
            </View>
          )}

          <Text style={styles.statusSectionTitle}>Etapa actual</Text>
          
          <View style={styles.statusButtonsContainer}>
            <TouchableOpacity 
              style={[
                styles.statusButton, 
                etapaActual === 'carga completada' && styles.statusButtonActive
              ]}
              onPress={() => setEtapaActual('carga completada')}
            >
              <Text style={[
                styles.statusButtonText,
                etapaActual === 'carga completada' && styles.statusButtonTextActive
              ]}>Carga completada</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.statusButton, 
                etapaActual === 'en viaje' && styles.statusButtonActive
              ]}
              onPress={() => setEtapaActual('en viaje')}
            >
              <Text style={[
                styles.statusButtonText,
                etapaActual === 'en viaje' && styles.statusButtonTextActive
              ]}>Viajando</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.statusButton, 
                etapaActual === 'descarga completada' && styles.statusButtonActive
              ]}
              onPress={() => setEtapaActual('descarga completada')}
            >
              <Text style={[
                styles.statusButtonText,
                etapaActual === 'descarga completada' && styles.statusButtonTextActive
              ]}>Descarga completada</Text>
            </TouchableOpacity>
          </View>

                    {/* Botón de enviar */}
          <TouchableOpacity 
            style={styles.sendButton}
            onPress={handleSendReport}
          >
            <Text style={styles.sendButtonText}>Enviar notificación</Text>
          </TouchableOpacity>
          
          {/* Mensaje de confirmación (solo aparece después de enviar) */}
          {reportSent && (
            <View style={styles.confirmationMessage}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.confirmationText}>Reporte enviado</Text>
            </View>
          )}
        </View>
        
        {/* Botón de Emergencia */}
        <TouchableOpacity 
          style={styles.emergencyButton}
          onPress={() => setEmergencyModalVisible(true)}
        >
          <Ionicons name="warning" size={24} color="#fff" />
          <Text style={styles.emergencyButtonText}>EMERGENCIA</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Modal de Emergencia */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={emergencyModalVisible}
        onRequestClose={() => setEmergencyModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Contactos de emergencia</Text>
            <Text style={styles.modalSubtitle}>Si presenta un problema crítico, use estas opciones:</Text>
            
            <TouchableOpacity 
              style={styles.emergencyContactButton}
              onPress={() => callNumber('123.456.7890')}
            >
              <Text style={styles.emergencyContactName}>Oscar Jefe:</Text>
              <Text style={styles.emergencyContactNumber}>123.456.7890</Text>
              <Ionicons name="call" size={24} color="#4CAF50" style={styles.callIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.emergencyContactButton}
              onPress={() => callNumber('321.654.0987')}
            >
              <Text style={styles.emergencyContactName}>Soporte técnico:</Text>
              <Text style={styles.emergencyContactNumber}>321.654.0987</Text>
              <Ionicons name="call" size={24} color="#4CAF50" style={styles.callIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.emergencyContactButton}
              onPress={() => callNumber('911')}
            >
              <Text style={styles.emergencyContactName}>Línea de Emergencias Médicas:</Text>
              <Text style={styles.emergencyContactNumber}>911</Text>
              <Ionicons name="call" size={24} color="#4CAF50" style={styles.callIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.emergencyContactButton}
              onPress={() => callNumber('210.753.0123')}
            >
              <Text style={styles.emergencyContactName}>Seguro y Asistencia:</Text>
              <Text style={styles.emergencyContactNumber}>210.753.0123</Text>
              <Ionicons name="call" size={24} color="#4CAF50" style={styles.callIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setEmergencyModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Modal para seleccionar imagen */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={imageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.imageModalContent}>
            <Text style={styles.modalTitle}>Agregar imagen</Text>
            <Text style={styles.modalSubtitle}>Seleccione cómo desea agregar imágenes:</Text>
            
            <TouchableOpacity 
              style={styles.imageOptionButton}
              onPress={openCamera}
            >
              <Ionicons name="camera" size={30} color="#FF9500" />
              <Text style={styles.imageOptionText}>Tomar foto con la cámara</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.imageOptionButton}
              onPress={openGallery}
            >
              <Ionicons name="images" size={30} color="#FF9500" />
              <Text style={styles.imageOptionText}>Seleccionar de la galería</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setImageModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  reportSection: {
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
  reportSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  dropdownContainer: {
    position: 'relative',
    marginBottom: 15,
    zIndex: 1000,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1001,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  reportInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9500',
    borderRadius: 10,
    padding: 12,
    flex: 0.48,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmationMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  confirmationText: {
    color: '#4CAF50',
    marginLeft: 5,
    fontSize: 14,
  },
  statusSection: {
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
  statusSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 0.32,
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 10,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#FF9500',
  },
  statusButtonText: {
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    justifyContent: 'center',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  cargoStatusSection: {
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
  cargoStatusButtonsContainer: {
    gap: 10,
  },
  cargoStatusButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  cargoStatusButtonActive: {
    backgroundColor: '#FF9500',
  },
  cargoStatusButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#DC3545',
    borderRadius: 25,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emergencyButtonText: {
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC3545',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  emergencyContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
  },
  emergencyContactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  emergencyContactNumber: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  callIcon: {
    marginLeft: 5,
  },
  closeModalButton: {
    backgroundColor: '#666',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  selectedImagesContainer: {
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cce5ff',
  },
  selectedImagesText: {
    color: '#0066cc',
    fontWeight: '500',
  },
  imageModalContent: {
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
  imageOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
  },
  imageOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
});

export default ReportesScreen;