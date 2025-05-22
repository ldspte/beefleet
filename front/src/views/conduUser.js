import React , {useEffect, useState} from 'react';
import { View, Text, TextInput , StyleSheet, Image, ActivityIndicator , Alert, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConduUser = ({navigation}) => {

    const [driverInfo, setDriverInfo] = useState({
      tipo_documento:'',
      documento:'',
      nombre_conductor:'',
      apellido_conductor:'',
      correo_conductor:'',
      foto:'',
      telefono:'',
      ciudad:'',
      direccion:'',
      tipo_licencia:'',
      fecha_vencimiento:'',
      experiencia:''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const driverId = await AsyncStorage.getItem('id_conductor'); // Asegúrate de que este ID sea el correcto
                console.log(driverId);
                const response = await fetch(`http://localhost:3001/api/drivers/${driverId}`, { // Cambia localhost por tu IP
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Asegúrate de que tu API acepte el token en el encabezado
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data); // Verifica la estructura de la respuesta
                    setDriverInfo(data); // Asumiendo que la respuesta tiene la estructura adecuada
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
        return <ActivityIndicator size="large" color="#0000ff" />; // Indicador de carga
    }
  

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']} // Puedes cambiar estos colores
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView style={styles.scroll}> 
        <View style={styles.container}>
          <View style={styles.header}>
            <Image 
              //source={require('../assets/user.png')}
              source={{  uri: driverInfo.foto ? uri: driverInfo.foto   }} 
              style={styles.profileImage}
            />
            <Text style={styles.name} >{driverInfo[0].nombre_conductor}</Text>
            <Text style={styles.subtitle}>Conductor Activo</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Documento:</Text>
              <Text style={styles.infoValue}>{driverInfo[0].documento}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{driverInfo[0].correo_conductor}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Teléfono:</Text>
              <Text style={styles.infoValue} >{driverInfo[0].telefono}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dirección:</Text>
              <Text style={styles.infoValue}>{driverInfo[0].direccion}</Text>
            </View>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Información Laboral</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Número de Licencia:</Text>
              <Text style={styles.infoValue}>{driverInfo[0].tipo_licencia}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha de vencimiento:</Text>
              <Text mode={"date"} style={styles.infoValue}>{driverInfo[0].fecha_vencimiento}</Text>
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
                <Text style={styles.statNumber}>{driverInfo[0].experiencia} años</Text>
                <Text style={styles.statLabel}>Experiencia</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Welcome')}
          >
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>  
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
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
    flex: 1,
  }
});

export default ConduUser;