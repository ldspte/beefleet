import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Image } from 'react-native';

import LogoBee from './componentes/logo';

export default function App() {
  return (
    <View style={styles.container}>
        <Image source={{uri: 'https://s3-alpha-sig.figma.com/img/9c37/1d78/f7c2c5897a2a93bd3a0f4430c1ed259f?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=gNfIc-73BOWY8NkeyrtVJ2eZ1l01g9XX39Icgx4zsR2rGCf36oTcyKqPPbzRY0-qXXga1epIvENT11u8Xi6LjCJo4h2KBkAXF5Rpu5dqYTq~ELJQj79xqJRZrCXg3yx5OtR6yB7x5jTsW~~M9ynxmMyr-vtBvKJCY3gjYoAvYNTdfxxC~7LvZ4YMxu3t7xo0wroenWBDNoOzNXt2JEMbDEs6nYAaYCg0dS49T-G44PP7r9LqvpZYhsnQSQKdZw4zikjTvRDdon70B7jRUCfr3kfKfGp6knOYiHtu0-ySXKVC-SrDqCyzWQytqA9gxLRa-uCx8J4P3Qqp2hIikvn~PQ__'}} 
        style={styles.fondo}/>
        <LogoBee />
        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0  500',
    flexDirection: 'column'
  },
  fondo: {
    width: '100%', 
    height: '100%',
    resizeMode: 'cover'
  }
});

