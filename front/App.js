import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ImageBackground , View , Image } from 'react-native';

import logo from './assets/logo.png';
import fondo from './assets/fondo.png';

export default function App() {
  return (
    <View style={styles.container}>
        <ImageBackground source={fondo} style={styles.fondo}>
          <Image source={logo} style={styles.logo} />
        </ImageBackground>
        <StatusBar style="auto" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:'1',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  fondo: {
    width: '100%', 
    height:'100%',
    justifyContent:'center',
    flex:'1',
    resizeMode:'cover', 
    alignItems:'center'
  },
  logo:{
    width: '70%',
    height: '30%',
    position: 'absolute',
    top: '3%'
  }
});
