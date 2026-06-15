import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';

interface Props {
  label: string;
  value: number;
  min?: number;
  max?: number;
  labelMin: string;
  labelMax: string;
  onChange: (v: number) => void;
}

// Slider nativo simples usando botões de incremento
export default function SliderInput({ label, value, min = 0, max = 10, labelMin, labelMax, onChange }: Props) {
  const pct = ((value - min) / (max - min)) * 100;

  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.badge, { backgroundColor: getBadgeColor(pct) }]}>
          <Text style={styles.badgeText}>{value.toFixed(0)}</Text>
        </View>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` as any }]} />
        {steps.map(s => (
          <View
            key={s}
            style={[
              styles.dot,
              { left: `${((s - min) / (max - min)) * 100}%` as any },
              s <= value && styles.dotActive,
            ]}
          />
        ))}
        {/* Botões invisíveis sobre a track */}
        <View style={styles.buttonsRow}>
          {steps.map(s => (
            <Text key={s} style={styles.hitArea} onPress={() => onChange(s)} />
          ))}
        </View>
      </View>

      <View style={styles.labels}>
        <Text style={styles.labelEdge}>{labelMin}</Text>
        <Text style={styles.labelEdge}>{labelMax}</Text>
      </View>
    </View>
  );
}

function getBadgeColor(pct: number) {
  if (pct <= 33) return Colors.urgenciaBaixa;
  if (pct <= 66) return Colors.urgenciaMedia;
  return Colors.urgenciaAlta;
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  track: { height: 8, backgroundColor: Colors.border, borderRadius: 4, position: 'relative', justifyContent: 'center' },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: Colors.primary, borderRadius: 4 },
  dot: { position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.border, marginLeft: -3, top: 1 },
  dotActive: { backgroundColor: Colors.primary },
  buttonsRow: { position: 'absolute', left: 0, right: 0, top: -12, bottom: -12, flexDirection: 'row' },
  hitArea: { flex: 1, height: '100%' },
  labels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  labelEdge: { fontSize: 11, color: Colors.textMuted },
});
