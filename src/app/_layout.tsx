import { Stack } from 'expo-router';
import { Platform, StatusBar } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function TriagemLayout() {
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: Colors.white,
        paddingTop: statusBarHeight, // 👈 empurra o conteúdo do header para baixo
      } as any,
      headerTitleStyle: { fontWeight: '700', color: Colors.text },
      headerTintColor: Colors.primary,
      headerShadowVisible: false,
    }} />
  );
}