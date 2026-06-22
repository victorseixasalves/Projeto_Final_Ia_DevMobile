// Serviço de lógica fuzzy (local, sem servidor)
// Inputs: Letargia (0-10), Apetite (0-10), Freq Respiratória (0-10),
//         Hidratação (0-10), Mucosas (0=normal, 10=cianose)

// Função triangular: retorna 0 nas extremidades, 1 no pico b
function trimf(x: number, a: number, b: number, c: number): number {
  if (x <= a || x >= c) return 0;
  if (x === b) return 1;
  if (x < b) return (x - a) / (b - a);
  return (c - x) / (c - b);
}

// Função trapezoidal: retorna 1 no plateau [b,c], rampa em [a,b] e [c,d]
// CORRIGIDO: uso de < e > (sem =) para incluir corretamente os extremos 0 e 10
function trapmf(x: number, a: number, b: number, c: number, d: number): number {
  if (x < a || x > d) return 0;
  if (x >= b && x <= c) return 1;
  if (x < b) return (x - a) / (b - a);
  return (d - x) / (d - c);
}

export interface TriagemInput {
  letargia: number;    // 0-10 (0=ativo, 10=imóvel)
  apetite: number;     // 0-10 (0=sem apetite, 10=normal)
  freqResp: number;    // 0-10 (0=normal, 10=muito alterada)
  hidratacao: number;  // 0-10 (0=normal, 10=muito desidratado)
  mucosas: number;     // 0-10 (0=normal/róseas, 10=cianose)
}

export interface TriagemResult {
  score: number;
  nivel: 'Baixa' | 'Media' | 'Alta';
  cor: string;
  corLight: string;
  mensagem: string;
}

export function calcularUrgencia(input: TriagemInput): TriagemResult {
  const { letargia, apetite, freqResp, hidratacao, mucosas } = input;

  // --- Funções de pertinência ---

  // Letargia (0=ativo, 10=imóvel)
  const let_baixa = trapmf(letargia, 0, 0, 2, 4);
  const let_media = trimf(letargia, 2, 5, 8);
  const let_alta  = trapmf(letargia, 6, 8, 10, 10);

  // Apetite (0=sem apetite [ruim], 10=normal [bom])
  const apet_baixo  = trapmf(apetite, 0, 0, 2, 4);
  const apet_medio  = trimf(apetite, 2, 5, 8);
  const apet_normal = trapmf(apetite, 6, 8, 10, 10);

  // Frequência Respiratória (0=normal, 10=muito alterada)
  const resp_normal   = trapmf(freqResp, 0, 0, 2, 4);
  const resp_alterada = trimf(freqResp, 2, 5, 8);
  const resp_critica  = trapmf(freqResp, 6, 8, 10, 10);

  // Hidratação (0=hidratado, 10=muito desidratado)
  const hid_normal   = trapmf(hidratacao, 0, 0, 2, 4);
  const hid_moderada = trimf(hidratacao, 2, 5, 8);
  const hid_grave    = trapmf(hidratacao, 6, 8, 10, 10);

  // Mucosas (0=róseas/normal, 10=cianose)
  const muc_normal  = trapmf(mucosas, 0, 0, 2, 4);
  const muc_palida  = trimf(mucosas, 2, 5, 8);
  const muc_cianose = trapmf(mucosas, 6, 8, 10, 10);

  // --- Regras fuzzy com defuzzificação por centroide ponderado ---
  // Outputs: Baixa ≈ 10–25 | Média ≈ 45–60 | Alta ≈ 80–95
  const rules: { strength: number; output: number }[] = [

    // ── ALTA urgência ──────────────────────────────────────────────────────
    { strength: Math.min(let_alta, apet_baixo),                 output: 85 },
    { strength: Math.min(let_alta, resp_critica),               output: 90 },
    { strength: Math.min(let_alta, muc_cianose),                output: 95 },
    { strength: Math.min(muc_cianose, resp_critica),            output: 90 },
    { strength: Math.min(hid_grave, let_alta),                  output: 85 },
    { strength: Math.min(let_alta, hid_grave, muc_cianose),     output: 95 },
    { strength: Math.min(resp_critica, apet_baixo),             output: 80 },
    { strength: Math.min(hid_grave, resp_critica),              output: 85 },
    { strength: Math.min(hid_grave, muc_cianose),               output: 90 },
    { strength: Math.min(let_alta, resp_critica, hid_grave),    output: 95 },

    // ── MÉDIA urgência ─────────────────────────────────────────────────────
    { strength: Math.min(let_media, apet_baixo),                output: 50 },
    { strength: Math.min(let_alta, apet_medio),                 output: 60 },
    { strength: Math.min(let_baixa, resp_critica),              output: 55 },
    { strength: Math.min(let_media, resp_alterada),             output: 50 },
    { strength: Math.min(let_baixa, hid_grave),                 output: 50 },
    { strength: Math.min(hid_moderada, let_media),              output: 45 },
    { strength: Math.min(let_media, muc_palida),                output: 50 },
    { strength: Math.min(let_alta, apet_normal, resp_normal),   output: 55 },
    { strength: Math.min(hid_moderada, muc_palida),             output: 45 },
    { strength: Math.min(hid_moderada, resp_alterada),          output: 50 },
    { strength: Math.min(muc_palida, apet_baixo),               output: 50 },
    { strength: Math.min(let_alta, hid_moderada),               output: 60 },
    { strength: Math.min(let_alta, muc_palida),                 output: 60 },
    { strength: Math.min(resp_alterada, apet_baixo),            output: 55 },

    // ── BAIXA urgência ─────────────────────────────────────────────────────
    { strength: Math.min(let_baixa, apet_normal, resp_normal, hid_normal, muc_normal), output: 10 },
    { strength: Math.min(let_baixa, apet_normal, muc_normal),  output: 15 },
    { strength: Math.min(let_baixa, apet_medio, resp_normal),  output: 20 },
    { strength: Math.min(let_media, apet_normal, resp_normal, hid_normal), output: 25 },
    { strength: Math.min(let_baixa, hid_normal, muc_normal),   output: 10 },
  ];

  // Defuzzificação: média ponderada das saídas pelo grau de ativação
  let numerator = 0;
  let denominator = 0;
  for (const rule of rules) {
    if (rule.strength > 0) {
      numerator   += rule.strength * rule.output;
      denominator += rule.strength;
    }
  }

  const score = denominator > 0 ? Math.round(numerator / denominator) : 10;

  if (score >= 60) {
    return {
      score,
      nivel: 'Alta',
      cor: '#C62828',
      corLight: '#FFEBEE',
      mensagem: 'Procure atendimento veterinário imediatamente. Situação potencialmente grave.',
    };
  } else if (score >= 35) {
    return {
      score,
      nivel: 'Media',
      cor: '#F9A825',
      corLight: '#FFF8E1',
      mensagem: 'Agende uma consulta com urgência. Monitore o animal de perto.',
    };
  } else {
    return {
      score,
      nivel: 'Baixa',
      cor: '#2E7D32',
      corLight: '#E8F5E9',
      mensagem: 'Situação estável. Agende uma consulta de rotina se os sintomas persistirem.',
    };
  }
}