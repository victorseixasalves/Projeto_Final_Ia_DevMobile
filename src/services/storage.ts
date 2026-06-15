import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Tutor {
  id: string;
  nome: string;
  email: string;
  telefone: string;
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
  tutor: 'petcare_tutor',
  animais: 'petcare_animais',
  triagens: 'petcare_triagens',
};

// TUTOR
export async function saveTutor(tutor: Tutor) {
  await AsyncStorage.setItem(KEYS.tutor, JSON.stringify(tutor));
}
export async function getTutor(): Promise<Tutor | null> {
  const v = await AsyncStorage.getItem(KEYS.tutor);
  return v ? JSON.parse(v) : null;
}
export async function clearTutor() {
  await AsyncStorage.removeItem(KEYS.tutor);
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
