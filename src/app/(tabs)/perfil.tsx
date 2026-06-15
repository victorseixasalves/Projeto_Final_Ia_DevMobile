import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { getTutor, clearTutor } from '../../services/storage';

export default function PerfilScreen() {
  const [tutor, setTutor] = useState<any>(null);

    useFocusEffect(useCallback(() => {
      const carregar = async () => {
        const t = await getTutor();
        if (!t) router.replace('/(auth)/login');
       else setTutor(t);
     };
     carregar();
    }, []));

  function handleLogout() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: async () => { await clearTutor(); router.replace('/(auth)/login'); } },
    ]);
  }

  if (!tutor) return null;

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{tutor.nome?.[0]?.toUpperCase() || '?'}</Text>
      </View>
      <Text style={styles.name}>{tutor.nome}</Text>
      <Text style={styles.email}>{tutor.email}</Text>
      {tutor.telefone ? <Text style={styles.phone}>{tutor.telefone}</Text> : null}

      <View style={styles.divider} />

      <View style={styles.infoBox}>
        <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} />
        <Text style={styles.infoText}>Esta é uma triagem de apoio. Não substitui avaliação veterinária profissional.</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Colors.urgenciaAlta} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', padding: 24, paddingTop: 48 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  avatarText: { fontSize: 38, fontWeight: '800', color: Colors.white },
  name: { fontSize: 22, fontWeight: '800', color: Colors.text },
  email: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  phone: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  divider: { width: '100%', height: 1, backgroundColor: Colors.border, marginVertical: 24 },
  infoBox: { flexDirection: 'row', backgroundColor: Colors.primaryLight, borderRadius: 12, padding: 14, gap: 10, alignItems: 'flex-start', width: '100%' },
  infoText: { flex: 1, fontSize: 13, color: Colors.primary, lineHeight: 20 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 32, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: Colors.urgenciaAlta, width: '100%', justifyContent: 'center' },
  logoutText: { fontSize: 15, fontWeight: '600', color: Colors.urgenciaAlta },
});
