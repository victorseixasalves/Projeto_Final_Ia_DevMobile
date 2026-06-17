import { Stack } from 'expo-router';
import { Colors } from '../../../constants/Colors';
export default function TriagemLayout() {
  
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: Colors.white },
      headerTitleStyle: { fontWeight: '700', color: Colors.text },
      headerTintColor: Colors.primary,
      headerShadowVisible: false,
    }} />
  );
}