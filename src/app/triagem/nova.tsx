import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { calcularUrgencia } from '../../services/fuzzy';
import { saveTriagem } from '../../services/storage';
import SliderInput from '../../components/ui/SliderInput';

const MUCOSAS_OPTIONS = [
  { value: 0, label: 'Róseas (Normal)' },
  { value: 3, label: 'Pálidas' },
  { value: 6, label: 'Ictéricas (amareladas)' },
  { value: 8, label: 'Cianóticas (azuladas)' },
  { value: 10, label: 'Cianose grave' },
];

export default function NovaTriagemScreen() {
  const { animalId } = useLocalSearchParams<{ animalId: string }>();
  const navigation = useNavigation();
  const [letargia, setLetargia] = useState(0);
  const [apetite, setApetite] = useState(10);
  const [freqResp, setFreqResp] = useState(0);
  const [hidratacao, setHidratacao] = useState(0);
  const [mucosas, setMucosas] = useState(0);
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    navigation.setOptions({ title: 'Nova Triagem' });
  }, []);

  function handleAvaliar() {
    const result = calcularUrgencia({ letargia, apetite, freqResp, hidratacao, mucosas });
    const triagem = {
      id: Date.now().toString(),
      animalId: animalId!,
      letargia, apetite, freqResp, hidratacao, mucosas,
      score: result.score,
      nivel: result.nivel,
      cor: result.cor,
      observacoes,
      data: new Date().toISOString(),
    };
    saveTriagem(triagem);
    router.replace(`/triagem/resultado?json=${encodeURIComponent(JSON.stringify({ ...triagem, mensagem: result.mensagem, corLight: result.corLight }))}`);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
          <Text style={styles.infoText}>Avalie os sintomas observados nas últimas horas. Valores padrão = animal saudável.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🐾</Text>
            <Text style={styles.cardTitle}>Comportamento</Text>
          </View>
          <SliderInput label="Letargia (nível de energia)" value={letargia} labelMin="Ativo e alerta" labelMax="Imóvel / sem resposta" onChange={setLetargia} />
          <SliderInput label="Apetite" value={apetite} labelMin="Sem apetite" labelMax="Apetite normal" onChange={setApetite} invertColor />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>💓</Text>
            <Text style={styles.cardTitle}>Sinais Vitais</Text>
          </View>
          <SliderInput label="Frequência respiratória" value={freqResp} labelMin="Normal e regular" labelMax="Muito alterada / ofegante" onChange={setFreqResp} />
          <SliderInput label="Hidratação" value={hidratacao} labelMin="Bem hidratado" labelMax="Muito desidratado" onChange={setHidratacao} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>👁️</Text>
            <Text style={styles.cardTitle}>Coloração das Mucosas</Text>
          </View>
          <Text style={styles.mucosaHelp}>Observe gengivas e olhos do animal:</Text>
          <View style={styles.mucosaOptions}>
            {MUCOSAS_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.mucosaBtn, mucosas === opt.value && styles.mucosaBtnActive]}
                onPress={() => setMucosas(opt.value)}
              >
                <View style={[styles.mucosaDot, { backgroundColor: getMucosaColor(opt.value) }]} />
                <Text style={[styles.mucosaText, mucosas === opt.value && styles.mucosaTextActive]}>{opt.label}</Text>
                {mucosas === opt.value && <Ionicons name="checkmark-circle" size={16} color={Colors.primary} style={{ marginLeft: 'auto' }} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📝</Text>
            <Text style={styles.cardTitle}>Observações</Text>
          </View>
          <TextInput
            style={styles.obsInput}
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Descreva outros sintomas observados..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.avaliarBtn} onPress={handleAvaliar}>
          <Ionicons name="pulse" size={22} color={Colors.white} />
          <Text style={styles.avaliarBtnText}>Avaliar Urgência</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>⚠️ Esta triagem é um apoio. Não substitui avaliação veterinária.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getMucosaColor(v: number) {
  if (v === 0) return '#F48FB1';
  if (v <= 3) return '#FFCDD2';
  if (v <= 6) return '#FFF176';
  return '#90CAF9';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  infoBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: Colors.primaryLight, borderRadius: 12, padding: 12, marginBottom: 14 },
  infoText: { flex: 1, fontSize: 13, color: Colors.primary, lineHeight: 19 },
  card: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardIcon: { fontSize: 20 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  mucosaHelp: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10 },
  mucosaOptions: { gap: 8 },
  mucosaBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background },
  mucosaBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  mucosaDot: { width: 16, height: 16, borderRadius: 8 },
  mucosaText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  mucosaTextActive: { color: Colors.primary, fontWeight: '700' },
  obsInput: { backgroundColor: Colors.background, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: Colors.text, borderWidth: 1, borderColor: Colors.border, minHeight: 80, textAlignVertical: 'top' },
  avaliarBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 5 },
  avaliarBtnText: { color: Colors.white, fontSize: 17, fontWeight: '800' },
  disclaimer: { textAlign: 'center', fontSize: 12, color: Colors.textMuted, marginTop: 16, lineHeight: 18 },
});