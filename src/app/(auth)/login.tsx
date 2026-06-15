import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import { saveTutor } from '../../services/storage';

export default function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'cadastro'>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    if (mode === 'cadastro' && !nome) {
      Alert.alert('Atenção', 'Preencha seu nome.');
      return;
    }
    setLoading(true);
    await saveTutor({
      id: Date.now().toString(),
      nome: mode === 'login' ? email.split('@')[0] : nome,
      email,
      telefone,
    });
    setLoading(false);
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>🐾</Text>
          </View>
          <Text style={styles.appName}>PetCare</Text>
          <Text style={styles.appSub}>Triagem Inteligente</Text>
        </View>

        {/* Toggle */}
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'login' && styles.toggleActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'cadastro' && styles.toggleActive]}
            onPress={() => setMode('cadastro')}
          >
            <Text style={[styles.toggleText, mode === 'cadastro' && styles.toggleTextActive]}>Criar Conta</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.card}>
          {mode === 'cadastro' && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nome completo</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome" placeholderTextColor={Colors.textMuted} />
            </View>
          )}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>E-mail</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="seu@email.com" placeholderTextColor={Colors.textMuted} keyboardType="email-address" autoCapitalize="none" />
          </View>
          {mode === 'cadastro' && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Telefone</Text>
              <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="(00) 00000-0000" placeholderTextColor={Colors.textMuted} keyboardType="phone-pad" />
            </View>
          )}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Senha</Text>
            <TextInput style={styles.input} value={senha} onChangeText={setSenha} placeholder="••••••••" placeholderTextColor={Colors.textMuted} secureTextEntry />
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Esta é uma triagem de apoio. Não substitui avaliação veterinária.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 32 },
  logoBox: { width: 80, height: 80, borderRadius: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  logoIcon: { fontSize: 38 },
  appName: { fontSize: 32, fontWeight: '800', color: Colors.text },
  appSub: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  toggle: { flexDirection: 'row', backgroundColor: Colors.border, borderRadius: 12, padding: 4, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  toggleActive: { backgroundColor: Colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  toggleText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  toggleTextActive: { color: Colors.primary },
  card: { backgroundColor: Colors.white, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  input: { backgroundColor: Colors.background, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border },
  btn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 8, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  btnText: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  footer: { textAlign: 'center', fontSize: 12, color: Colors.textMuted, marginTop: 24, lineHeight: 18 },
});
