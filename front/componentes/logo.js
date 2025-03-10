import logo from './assets/logo.png';

export default function LogoBee() {
  return (
    <View style={styles.container}>
        <Image source={logo} style={styles.logo} />
        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: '70%',
    height: '30%',
    position: 'absolute',
    top: '3%'
  }
});