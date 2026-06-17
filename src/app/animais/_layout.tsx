import { Stack } from 'expo-router';
import { Platform, StatusBar, View } from 'react-native';
import { Colors } from '../../../constants/Colors';

export default function AnimaisLayout() {
  return (
    <View style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.white },
          headerTitleStyle: { fontWeight: '700', color: Colors.text },
          headerTintColor: Colors.primary,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="[id]" options={{ title: '' }} />
      </Stack>
    </View>
  );
}