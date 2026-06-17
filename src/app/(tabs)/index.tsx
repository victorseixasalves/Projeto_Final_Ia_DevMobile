import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Alert, RefreshControl
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../../constants/Colors';
import { getAnimais, deleteAnimal, Animal, getTutor } from '../../services/storage';

const ESPECIES: Record<string, string> = {
  cao: '🐕', gato: '🐈', coelho: '🐇', ave: '🦜', outro: '🐾',
};

export default function HomeScreen() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 👇 LOG TEMPORÁRIO — remova depois de verificar
  useEffect(() => {
    async function verBanco() {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys);
      console.log('=== BANCO DE DADOS ===');
      values.forEach(([key, value]) => {
        try {
          console.log(key, JSON.parse(value || '{}'));
        } catch {
          console.log(key, value);
        }
      });
      console.log('======================');
    }
    verBanco();
  }, []);

  const load = useCallback(() => {
    const carregar = async () => {
      setLoading(true);
      const t = await getTutor();
      if (!t) { router.replace('/(auth)/login'); return; }
      setTutor(t);
      const list = await getAnimais();
      setAnimais(list.filter(a => a.tutorId === t.id));
      setLoading(false);
    };
    carregar();
  }, []);

  useFocusEffect(load);

  function confirmDelete(animal: Animal) {
    Alert.alert('Remover animal', `Deseja remover ${animal.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: async () => { await deleteAnimal(animal.id); load(); } },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <View>
          <Text style={styles.greetingHello}>Olá, {tutor?.nome?.split(' ')[0] || 'Tutor'} 👋</Text>
          <Text style={styles.greetingSub}>{animais.length} {animais.length === 1 ? 'pet cadastrado' : 'pets cadastrados'}</Text>
        </View>
      </View>

      {animais.length === 0 && !loading ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🐾</Text>
          <Text style={styles.emptyTitle}>Nenhum animal ainda</Text>
          <Text style={styles.emptySub}>Cadastre seu primeiro pet para começar uma triagem.</Text>
        </View>
      ) : (
        <FlatList
          data={animais}
          keyExtractor={a => a.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/animais/${item.id}`)}>
              <View style={styles.cardIcon}>
                <Text style={styles.cardIconText}>{ESPECIES[item.especie] || '🐾'}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.nome}</Text>
                <Text style={styles.cardSub}>{item.especie.charAt(0).toUpperCase() + item.especie.slice(1)}{item.raca ? ` • ${item.raca}` : ''}</Text>
                {item.idade ? <Text style={styles.cardMeta}>{item.idade} • {item.peso ? `${item.peso} kg` : ''}</Text> : null}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => router.push(`/animais/editar?id=${item.id}`)}>
                  <Ionicons name="create-outline" size={18} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item)}>
                  <Ionicons name="trash-outline" size={18} color={Colors.urgenciaAlta} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/animais/novo')}>
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  greeting: { padding: 20, paddingBottom: 8, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  greetingHello: { fontSize: 22, fontWeight: '800', color: Colors.text },
  greetingSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  list: { padding: 16, paddingBottom: 80 },
  card: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardIconText: { fontSize: 26 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  cardSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  cardMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: 8 },
  editBtn: { padding: 6 },
  deleteBtn: { padding: 6 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  emptySub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 58, height: 58, borderRadius: 29, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
});