import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const Welcome = ({ navigation }) => {
    return (
      <View style={styles.container}>
        <Text>'¡Hola de vuelta!'</Text>
        <Button
          title="Iniciar Sesión"
          onPress={() => navigation.navigate('LoginForm')}
        />
      </View>
    );
};
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
});

export default Welcome;