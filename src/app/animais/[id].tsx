import React, { useCallback, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet
} from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { getAnimais, getTriagens, Animal, Triagem } from '../../services/storage';

const ESPECIES: Record<string, string> = { cao: '🐕', gato: '🐈', coelho: '🐇', ave: '🦜', outro: '🐾' };

function NivelBadge({ nivel }: { nivel: string }) {
  const map: Record<string, { cor: string; light: string }> = {
    Baixa: { cor: Colors.urgenciaBaixa, light: Colors.urgenciaBaixaLight },
    Media: { cor: Colors.urgenciaMedia, light: Colors.urgenciaMediaLight },
    Alta: { cor: Colors.urgenciaAlta, light: Colors.urgenciaAltaLight },
  };
  const c = map[nivel] || map.Baixa;
  return (
    <View style={{ backgroundColor: c.light, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 }}>
      <Text style={{ color: c.cor, fontWeight: '700', fontSize: 12 }}>{nivel}</Text>
    </View>
  );
}

export default function AnimalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [triagens, setTriagens] = useState<Triagem[]>([]);

  useFocusEffect(useCallback(() => {
    getAnimais().then(list => setAnimal(list.find(a => a.id === id) || null));
    getTriagens(id!).then(setTriagens);
  }, [id]));

  if (!animal) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header do animal */}
      <View style={styles.header}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarIcon}>{ESPECIES[animal.especie] || '🐾'}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.animalName}>{animal.nome}</Text>
          <Text style={styles.animalSub}>
            {animal.especie.charAt(0).toUpperCase() + animal.especie.slice(1)}
            {animal.raca ? ` • ${animal.raca}` : ''}
            {animal.sexo === 'M' ? ' • Macho' : animal.sexo === 'F' ? ' • Fêmea' : ''}
          </Text>
          {(animal.idade || animal.peso) ? (
            <Text style={styles.animalMeta}>
              {animal.idade}{animal.idade && animal.peso ? ' • ' : ''}{animal.peso ? `${animal.peso} kg` : ''}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Botão Nova Triagem */}
      <TouchableOpacity style={styles.trigemBtn} onPress={() => router.push(`/triagem/nova?animalId=${id}`)}>
        <Ionicons name="pulse" size={22} color={Colors.white} />
        <Text style={styles.trigemBtnText}>Nova Triagem</Text>
        <Ionicons name="chevron-forward" size={18} color={Colors.white} />
      </TouchableOpacity>

      {/* Histórico */}
      <Text style={styles.sectionTitle}>Histórico de Triagens</Text>
      {triagens.length === 0 ? (
        <View style={styles.emptyHistory}>
          <Text style={styles.emptyHistoryIcon}>📋</Text>
          <Text style={styles.emptyHistoryText}>Nenhuma triagem realizada ainda.</Text>
        </View>
      ) : (
        triagens.map(t => (
          <TouchableOpacity key={t.id} style={styles.historyCard} onPress={() => router.push(`/triagem/resultado?json=${encodeURIComponent(JSON.stringify(t))}`)}>
            <View style={styles.historyLeft}>
              <View style={[styles.historyDot, { backgroundColor: t.cor }]} />
              <View>
                <Text style={styles.historyDate}>{new Date(t.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
                {t.observacoes ? <Text style={styles.historyObs} numberOfLines={1}>{t.observacoes}</Text> : null}
              </View>
            </View>
            <View style={styles.historyRight}>
              <NivelBadge nivel={t.nivel} />
              <Text style={styles.historyScore}>{t.score}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  header: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  avatarBox: { width: 68, height: 68, borderRadius: 34, backgroundColor: Colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarIcon: { fontSize: 34 },
  headerInfo: { flex: 1 },
  animalName: { fontSize: 20, fontWeight: '800', color: Colors.text },
  animalSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 3 },
  animalMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  trigemBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 22, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  trigemBtnText: { color: Colors.white, fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  emptyHistory: { alignItems: 'center', padding: 32 },
  emptyHistoryIcon: { fontSize: 40, marginBottom: 10 },
  emptyHistoryText: { fontSize: 14, color: Colors.textSecondary },
  historyCard: { backgroundColor: Colors.white, borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  historyDot: { width: 10, height: 10, borderRadius: 5 },
  historyDate: { fontSize: 13, fontWeight: '600', color: Colors.text },
  historyObs: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  historyRight: { alignItems: 'flex-end', gap: 4 },
  historyScore: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
});
