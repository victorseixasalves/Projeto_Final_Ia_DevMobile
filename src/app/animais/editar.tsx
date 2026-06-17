import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import { saveAnimal, getAnimais, Animal } from '../../services/storage';

const ESPECIES = [
  { key: 'cao', label: '🐕 Cão' }, { key: 'gato', label: '🐈 Gato' },
  { key: 'coelho', label: '🐇 Coelho' }, { key: 'ave', label: '🦜 Ave' }, { key: 'outro', label: '🐾 Outro' },
];
const SEXO = [{ key: 'M', label: 'Macho' }, { key: 'F', label: 'Fêmea' }];

export default function EditarAnimalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('cao');
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [sexo, setSexo] = useState('M');
  const [original, setOriginal] = useState<Animal | null>(null);

  useEffect(() => {
    navigation.setOptions({ title: 'Editar Animal' });
  }, []);

  useEffect(() => {
    getAnimais().then(list => {
      const a = list.find(x => x.id === id);
      if (a) { setOriginal(a); setNome(a.nome); setEspecie(a.especie); setRaca(a.raca); setIdade(a.idade); setPeso(a.peso); setSexo(a.sexo); }
    });
  }, [id]);

  async function handleSave() {
    if (!nome.trim()) { Alert.alert('Atenção', 'Informe o nome.'); return; }
    if (!original) return;
    await saveAnimal({ ...original, nome, especie, raca, idade, peso, sexo });
    router.back();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.section}>Editar Animal</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 }}>Nome *</Text>
          <TextInput style={[styles.input, { marginBottom: 16 }]} value={nome} onChangeText={setNome} placeholderTextColor={Colors.textMuted} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 }}>Espécie</Text>
          <View style={[styles.chips, { marginBottom: 16 }]}>
            {ESPECIES.map(e => (
              <TouchableOpacity key={e.key} style={[styles.chip, especie === e.key && styles.chipActive]} onPress={() => setEspecie(e.key)}>
                <Text style={[styles.chipText, especie === e.key && styles.chipTextActive]}>{e.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 }}>Sexo</Text>
          <View style={[styles.chips, { marginBottom: 16 }]}>
            {SEXO.map(s => (
              <TouchableOpacity key={s.key} style={[styles.chip, sexo === s.key && styles.chipActive, { flex: 1 }]} onPress={() => setSexo(s.key)}>
                <Text style={[styles.chipText, sexo === s.key && styles.chipTextActive]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 }}>Raça</Text>
          <TextInput style={[styles.input, { marginBottom: 16 }]} value={raca} onChangeText={setRaca} placeholder="Raça" placeholderTextColor={Colors.textMuted} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 }}>Idade</Text>
              <TextInput style={styles.input} value={idade} onChangeText={setIdade} placeholder="Ex: 3 anos" placeholderTextColor={Colors.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 }}>Peso (kg)</Text>
              <TextInput style={styles.input} value={peso} onChangeText={setPeso} keyboardType="decimal-pad" placeholder="Ex: 12.5" placeholderTextColor={Colors.textMuted} />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleSave}>
          <Text style={styles.btnText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  section: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  input: { backgroundColor: Colors.background, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.background },
  chipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  chipText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: Colors.primary, fontWeight: '700' },
  btn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
});