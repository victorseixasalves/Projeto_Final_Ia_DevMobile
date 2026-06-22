<div align="center">

<img src="assets/images/icon.png" alt="PetCare IA Logo" width="120" height="120" style="border-radius: 24px"/>

# 🐾 PetCare IA

**Triagem veterinária inteligente com Lógica Fuzzy para tutores de animais**

[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Sobre o Projeto

O **PetCare IA** é um aplicativo mobile desenvolvido como **Projeto Final** da disciplina de Inteligência Artificial para Desenvolvimento Mobile. Ele permite que tutores de animais realizem uma **triagem veterinária automatizada**, avaliando sintomas clínicos do pet e classificando o nível de urgência usando **Lógica Fuzzy** — sem a necessidade de conexão com servidores externos.

> ⚠️ Esta triagem é um **apoio ao tutor**, e não substitui a avaliação de um médico veterinário habilitado.

---

## ✨ Funcionalidades

- 🔐 **Autenticação local** — Cadastro e login com senha criptografada em SHA-256
- 🐶 **Gestão de animais** — Cadastre, edite e remova seus pets com informações completas
- 🩺 **Triagem inteligente** — Avalie 5 parâmetros clínicos via sliders e múltipla escolha
- 🤖 **Lógica Fuzzy local** — Motor de inferência fuzzy 100% offline, sem API externa
- 📊 **Resultado visual** — Score de urgência (0-100), nível (Baixa/Média/Alta) e orientações
- 📁 **Histórico de triagens** — Todas as triagens salvas localmente por animal
- 🌙 **Tema automático** — Suporte a tema claro e escuro pelo sistema

---

## 🧠 Como Funciona a Lógica Fuzzy

O motor de triagem avalia **5 variáveis de entrada** e produz um **score de urgência (0–100)**:

| Variável | Escala | Descrição |
|---|---|---|
| **Letargia** | 0–10 | 0 = ativo e alerta / 10 = imóvel, sem resposta |
| **Apetite** | 0–10 | 0 = sem apetite / 10 = apetite normal |
| **Freq. Respiratória** | 0–10 | 0 = normal e regular / 10 = muito alterada |
| **Hidratação** | 0–10 | 0 = bem hidratado / 10 = muito desidratado |
| **Mucosas** | 0–10 | 0 = róseas (normal) / 10 = cianose grave |

### Funções de Pertinência

Cada variável passa por funções **triangulares** (`trimf`) e **trapezoidais** (`trapmf`) que mapeiam o valor numérico em graus de pertinência fuzzy (baixo / médio / alto). Em seguida, **29 regras fuzzy** são avaliadas e combinadas por **média ponderada (centroide)** para gerar o score final.

### Níveis de Urgência

| Score | Nível | Cor | Orientação |
|---|---|---|---|
| 0–34 | 🟢 Baixa | Verde | Monitorar, agendar consulta de rotina |
| 35–59 | 🟡 Média | Amarelo | Agendar com urgência, monitorar de perto |
| 60–100 | 🔴 Alta | Vermelho | Buscar atendimento **imediatamente** |

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [React Native](https://reactnative.dev/) | 0.81.5 | Framework mobile |
| [Expo](https://expo.dev/) | ~54.0 | Plataforma e build |
| [Expo Router](https://expo.github.io/router) | ~6.0 | Navegação baseada em arquivos |
| [TypeScript](https://www.typescriptlang.org/) | ~5.9 | Tipagem estática |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | 2.2.0 | Persistência local de dados |
| [expo-crypto](https://docs.expo.dev/versions/latest/sdk/crypto/) | ~15.0 | Hash SHA-256 de senhas |
| [@expo/vector-icons](https://icons.expo.fyi/) | ^15.0 | Ícones (Ionicons) |
| [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) | ~4.1 | Animações fluidas |

---

## 📁 Estrutura do Projeto

```
├── assets/
│   ├── fonts/
│   └── images/
├── constants/
│   └── Colors.ts           # Paleta de cores (primária, urgências, temas)
└── src/
    ├── app/
    │   ├── (auth)/
    │   │   └── login.tsx       # Tela de login e cadastro
    │   ├── (tabs)/
    │   │   ├── index.tsx       # Lista de animais (Home)
    │   │   └── perfil.tsx      # Perfil do tutor
    │   ├── animais/
    │   │   ├── [id].tsx        # Detalhes e histórico do animal
    │   │   ├── novo.tsx        # Cadastrar novo animal
    │   │   └── editar.tsx      # Editar animal existente
    │   └── triagem/
    │       ├── nova.tsx        # Formulário de triagem
    │       └── resultado.tsx   # Resultado com score e orientações
    ├── components/
    │   └── ui/
    │       └── SliderInput.tsx  # Componente de slider reutilizável
    └── services/
        ├── fuzzy.ts            # Motor de lógica fuzzy (offline)
        └── storage.ts          # CRUD com AsyncStorage + hash de senha
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Dispositivo físico ou emulador (Android/iOS) com o app **Expo Go**

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/victorseixasalves/Projeto_Final_Ia_DevMobile.git

# 2. Acesse a pasta do projeto
cd Projeto_Final_Ia_DevMobile

# 3. Instale as dependências
npm install

# 4. Inicie o projeto
npm start
```

### Executando no dispositivo

Após rodar `npm start`, um **QR Code** aparecerá no terminal. Escaneie-o com o app **Expo Go** (disponível na App Store e Google Play) para rodar o app no seu celular.

```bash
# Ou rode diretamente em plataformas específicas:
npm run android   # Emulador Android
npm run ios       # Simulador iOS (macOS apenas)
npm run web       # Navegador web
```

---

## 📱 Telas do Aplicativo

| Tela | Descrição |
|---|---|
| **Login / Cadastro** | Autenticação do tutor com e-mail e senha |
| **Home (Animais)** | Lista todos os pets cadastrados pelo tutor |
| **Detalhes do Animal** | Informações do pet e histórico de triagens |
| **Nova Triagem** | Avaliação clínica com sliders e seleção de mucosas |
| **Resultado** | Score fuzzy, nível de urgência e orientações |
| **Perfil** | Dados do tutor e opção de logout |

---

## 🔒 Segurança e Privacidade

- **Sem servidor externo** — todos os dados ficam no dispositivo do usuário
- **Senha com hash SHA-256** — as senhas nunca são armazenadas em texto puro
- **Lógica fuzzy offline** — nenhuma informação clínica é enviada para a nuvem

---

## 👨‍💻 Autor

O projeto foi desenvolvido por **Victor Seixas Alves** e **Caio Luis Silva Macedo**

[![GitHub](https://img.shields.io/badge/GitHub-victorseixasalves-181717?style=for-the-badge&logo=github)](https://github.com/victorseixasalves)

---

<div align="center">
  <sub>Projeto Final — Inteligência Artificial para Desenvolvimento Mobile</sub>
</div>
