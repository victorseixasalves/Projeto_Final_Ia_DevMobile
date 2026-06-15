import { StyleSheet, Text, View } from 'react-native';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Abra o arquivo abaixo no seu editor para começar.
      </Text>
      <Text style={styles.path}>{path}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginHorizontal: 50 },
  title: { fontSize: 17, fontWeight: '300', textAlign: 'center' },
  path: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8 },
});