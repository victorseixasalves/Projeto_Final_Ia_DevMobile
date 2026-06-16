import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Tutor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
}

export interface Animal {
  id: string;
  tutorId: string;
  nome: string;
  especie: string;
  raca: string;
  idade: string;
  peso: string;
  sexo: string;
}

export interface Triagem {
  id: string;
  animalId: string;
  letargia: number;
  apetite: number;
  freqResp: number;
  hidratacao: number;
  mucosas: number;
  score: number;
  nivel: string;
  cor: string;
  observacoes: string;
  data: string;
}

const KEYS = {
  tutores: 'petcare_tutores',   // lista de todos os tutores cadastrados
  sessao: 'petcare_sessao',     // email do tutor logado atualmente
  animais: 'petcare_animais',
  triagens: 'petcare_triagens',
};

// TUTORES
export async function getTutores(): Promise<Tutor[]> {
  const v = await AsyncStorage.getItem(KEYS.tutores);
  return v ? JSON.parse(v) : [];
}

export async function saveTutor(tutor: Tutor) {
  const lista = await getTutores();
  const idx = lista.findIndex(t => t.email === tutor.email);
  if (idx >= 0) lista[idx] = tutor;
  else lista.push(tutor);
  await AsyncStorage.setItem(KEYS.tutores, JSON.stringify(lista));
  // salva sessão ao cadastrar
  await AsyncStorage.setItem(KEYS.sessao, tutor.email);
}

export async function getTutor(): Promise<Tutor | null> {
  const emailSessao = await AsyncStorage.getItem(KEYS.sessao);
  if (!emailSessao) return null;
  const lista = await getTutores();
  return lista.find(t => t.email === emailSessao) || null;
}

export async function findTutorByEmail(email: string): Promise<Tutor | null> {
  const lista = await getTutores();
  return lista.find(t => t.email === email) || null;
}

export async function iniciarSessao(email: string) {
  await AsyncStorage.setItem(KEYS.sessao, email);
}

// logout: apaga só a sessão, não apaga o cadastro
export async function clearTutor() {
  await AsyncStorage.removeItem(KEYS.sessao);
}

// ANIMAIS
export async function getAnimais(): Promise<Animal[]> {
  const v = await AsyncStorage.getItem(KEYS.animais);
  return v ? JSON.parse(v) : [];
}
export async function saveAnimal(animal: Animal) {
  const list = await getAnimais();
  const idx = list.findIndex(a => a.id === animal.id);
  if (idx >= 0) list[idx] = animal;
  else list.push(animal);
  await AsyncStorage.setItem(KEYS.animais, JSON.stringify(list));
}
export async function deleteAnimal(id: string) {
  const list = await getAnimais();
  await AsyncStorage.setItem(KEYS.animais, JSON.stringify(list.filter(a => a.id !== id)));
}

// TRIAGENS
export async function getTriagens(animalId: string): Promise<Triagem[]> {
  const v = await AsyncStorage.getItem(KEYS.triagens);
  const all: Triagem[] = v ? JSON.parse(v) : [];
  return all.filter(t => t.animalId === animalId).sort((a, b) => b.data.localeCompare(a.data));
}
export async function saveTriagem(triagem: Triagem) {
  const v = await AsyncStorage.getItem(KEYS.triagens);
  const all: Triagem[] = v ? JSON.parse(v) : [];
  all.push(triagem);
  await AsyncStorage.setItem(KEYS.triagens, JSON.stringify(all));
}