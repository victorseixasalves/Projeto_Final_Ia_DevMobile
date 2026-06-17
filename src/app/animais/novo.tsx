import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import { saveAnimal, getTutor } from '../../services/storage';

const ESPECIES = [
  { key: 'cao', label: '🐕 Cão' },
  { key: 'gato', label: '🐈 Gato' },
  { key: 'coelho', label: '🐇 Coelho' },
  { key: 'ave', label: '🦜 Ave' },
  { key: 'outro', label: '🐾 Outro' },
];
const SEXO = [
  { key: 'M', label: 'Macho' },
  { key: 'F', label: 'Fêmea' },
];

export default function NovoAnimalScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('cao');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [sexo, setSexo] = useState('M');

  useEffect(() => {
    navigation.setOptions({ title: 'Novo Animal' });
  }, []);

  async function handleSave() {
    if (!nome.trim()) { Alert.alert('Atenção', 'Informe o nome do animal.'); return; }
    const tutor = await getTutor();
    if (!tutor) { router.replace('/(auth)/login'); return; }
    await saveAnimal({ id: Date.now().toString(), tutorId: tutor.id, nome, especie, raca, idade, peso, sexo });
    router.back();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.section}>Dados do Animal</Text>

          <Field label="Nome *">
            <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome do pet" placeholderTextColor={Colors.textMuted} />
          </Field>

          <Field label="Espécie">
            <View style={styles.chips}>
              {ESPECIES.map(e => (
                <TouchableOpacity key={e.key} style={[styles.chip, especie === e.key && styles.chipActive]} onPress={() => setEspecie(e.key)}>
                  <Text style={[styles.chipText, especie === e.key && styles.chipTextActive]}>{e.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          <Field label="Sexo">
            <View style={styles.chipsRow}>
              {SEXO.map(s => (
                <TouchableOpacity key={s.key} style={[styles.chip, sexo === s.key && styles.chipActive, { flex: 1 }]} onPress={() => setSexo(s.key)}>
                  <Text style={[styles.chipText, sexo === s.key && styles.chipTextActive]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>

          <Field label="Raça">
            <TextInput style={styles.input} value={raca} onChangeText={setRaca} placeholder="Ex: Labrador, SRD..." placeholderTextColor={Colors.textMuted} />
          </Field>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Field label="Idade">
                <TextInput style={styles.input} value={idade} onChangeText={setIdade} placeholder="Ex: 3 anos" placeholderTextColor={Colors.textMuted} />
              </Field>
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Peso (kg)">
                <TextInput style={styles.input} value={peso} onChangeText={setPeso} placeholder="Ex: 12.5" placeholderTextColor={Colors.textMuted} keyboardType="decimal-pad" />
              </Field>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>Cadastrar Animal</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 }}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  section: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  input: { backgroundColor: Colors.background, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipsRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: Colors.primary, fontWeight: '700' },
  row: { flexDirection: 'row' },
  btn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});