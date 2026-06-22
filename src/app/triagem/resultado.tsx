import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';

const NIVEL_CONFIG = {
  Baixa: {
    icon: '✅',
    title: 'BAIXA URGÊNCIA',
    icon2: 'checkmark-circle' as const,
    orientacoes: [
      'Monitore o animal nas próximas horas.',
      'Ofereça água fresca e alimentação normal.',
      'Agende consulta de rotina se os sintomas persistirem.',
      'Mantenha o animal em repouso e confortável.',
    ],
  },
  Media: {
    icon: '⚠️',
    title: 'MÉDIA URGÊNCIA',
    icon2: 'warning' as const,
    orientacoes: [
      'Agende uma consulta veterinária com urgência.',
      'Monitore os sintomas de perto — podem piorar.',
      'Evite alimentação forçada se houver recusa.',
      'Prepare o histórico de sintomas para o veterinário.',
    ],
  },
  Alta: {
    icon: '🚨',
    title: 'ALTA URGÊNCIA',
    icon2: 'alert-circle' as const,
    orientacoes: [
      'Procure atendimento veterinário IMEDIATAMENTE.',
      'Não espere os sintomas piorarem.',
      'Leve o animal em posição confortável e segura.',
      'Informe ao veterinário todos os sintomas observados.',
    ],
  },
};

export default function ResultadoScreen() {
  const { json } = useLocalSearchParams<{ json: string }>();
  const navigation = useNavigation();
  const data = json ? JSON.parse(decodeURIComponent(json)) : null;

  useEffect(() => {
    navigation.setOptions({ title: 'Resultado' });
  }, []);

  if (!data) return null;

  const config = NIVEL_CONFIG[data.nivel as keyof typeof NIVEL_CONFIG] || NIVEL_CONFIG.Baixa;
  const cor = data.cor;
  const corLight = data.corLight || '#E8F5E9';

  const inputs = [
    { label: 'Letargia', value: data.letargia, max: 10, invert: false },
    { label: 'Apetite', value: data.apetite, max: 10, invert: true },
    { label: 'Freq. Respiratória', value: data.freqResp, max: 10, invert: false },
    { label: 'Hidratação', value: data.hidratacao, max: 10, invert: false },
    { label: 'Mucosas', value: data.mucosas, max: 10, invert: false },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.resultCard, { borderColor: cor, backgroundColor: corLight }]}>
        <Text style={styles.resultEmoji}>{config.icon}</Text>
        <Text style={[styles.resultTitle, { color: cor }]}>{config.title}</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.scoreLabel}>Score de urgência:</Text>
          <Text style={[styles.scoreValue, { color: cor }]}>{data.score}/100</Text>
        </View>
        <View style={styles.scorebar}>
          <View style={[styles.scorebarFill, { width: `${data.score}%` as any, backgroundColor: cor }]} />
        </View>
        <Text style={[styles.mensagem, { color: cor }]}>{data.mensagem}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name={config.icon2} size={20} color={cor} />
          <Text style={styles.cardTitle}>O que fazer agora</Text>
        </View>
        {config.orientacoes.map((o, i) => (
          <View key={i} style={styles.orientacaoRow}>
            <View style={[styles.orientacaoDot, { backgroundColor: cor }]} />
            <Text style={styles.orientacaoText}>{o}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="bar-chart-outline" size={20} color={Colors.primary} />
          <Text style={styles.cardTitle}>Dados da Triagem</Text>
        </View>
        {inputs.filter(x => x.value !== undefined).map(inp => (
          <View key={inp.label} style={styles.inputRow}>
            <Text style={styles.inputLabel}>{inp.label}</Text>
            <View style={styles.inputBar}>
              <View style={[styles.inputBarFill, { width: `${(inp.value / inp.max) * 100}%` as any, backgroundColor: getBarColor(inp.value, inp.max, inp.invert) }]} />
            </View>
            <Text style={styles.inputValue}>{inp.value}</Text>
          </View>
        ))}
        {data.observacoes ? (
          <View style={styles.obsBox}>
            <Text style={styles.obsLabel}>Observações:</Text>
            <Text style={styles.obsText}>{data.observacoes}</Text>
          </View>
        ) : null}
        <Text style={styles.dateText}>
          {data.data ? new Date(data.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
        </Text>
      </View>

      <View style={styles.disclaimerBox}>
        <Ionicons name="shield-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.disclaimerText}>Esta triagem é um apoio. Não substitui a avaliação de um médico veterinário habilitado.</Text>
      </View>

      <TouchableOpacity style={styles.voltarBtn} onPress={() => router.back()}>
        <Text style={styles.voltarBtnText}>Voltar ao Animal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function getBarColor(v: number, max: number, invert: boolean = false) {
  const pct = v / max;
  const effectivePct = invert ? 1 - pct : pct;
  if (effectivePct <= 0.33) return Colors.urgenciaBaixa;
  if (effectivePct <= 0.66) return Colors.urgenciaMedia;
  return Colors.urgenciaAlta;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  resultCard: { borderRadius: 20, borderWidth: 2, padding: 24, alignItems: 'center', marginBottom: 14 },
  resultEmoji: { fontSize: 48, marginBottom: 8 },
  resultTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', letterSpacing: 0.5, marginBottom: 14 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  scoreLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  scoreValue: { fontSize: 24, fontWeight: '900' },
  scorebar: { width: '100%', height: 8, backgroundColor: '#0001', borderRadius: 4, marginBottom: 14, overflow: 'hidden' },
  scorebarFill: { height: '100%', borderRadius: 4 },
  mensagem: { fontSize: 15, textAlign: 'center', fontWeight: '600', lineHeight: 22 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  orientacaoRow: { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  orientacaoDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  orientacaoText: { flex: 1, fontSize: 14, color: Colors.text, lineHeight: 21 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  inputLabel: { width: 120, fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  inputBar: { flex: 1, height: 6, backgroundColor: Colors.border, borderRadius: 3, overflow: 'hidden' },
  inputBarFill: { height: '100%', borderRadius: 3 },
  inputValue: { width: 24, fontSize: 13, fontWeight: '700', color: Colors.text, textAlign: 'right' },
  obsBox: { marginTop: 8, backgroundColor: Colors.background, borderRadius: 8, padding: 10 },
  obsLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary, marginBottom: 4 },
  obsText: { fontSize: 13, color: Colors.text, lineHeight: 20 },
  dateText: { fontSize: 12, color: Colors.textMuted, marginTop: 10, textAlign: 'right' },
  disclaimerBox: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginBottom: 16 },
  disclaimerText: { flex: 1, fontSize: 12, color: Colors.textMuted, lineHeight: 18 },
  voltarBtn: { backgroundColor: Colors.primaryLight, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  voltarBtnText: { color: Colors.primary, fontSize: 15, fontWeight: '700' },
});