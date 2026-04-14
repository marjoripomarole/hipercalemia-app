const hipercalemiaCase = {
  id: "hipercalemia",
  meta: {
    badge: "Seminário de Medicina • Hipercalemia",
    title: "Quem salva esse paciente?",
    description:
      "Agora o caso funciona como uma árvore de decisão: escolhas erradas continuam o jogo, mas levam a consequências clínicas e becos sem saída.",
  },
  initialNodeId: "start",
  scoredDecisionIds: ["start", "severity", "stabilize", "shift", "cause"],
  nodes: {
    start: {
      id: "start",
      kind: "decision",
      title: "Pronto atendimento: começo do caso",
      icon: "Stethoscope",
      scene:
        "Paciente chega ao pronto atendimento com fraqueza muscular, náuseas e palpitações. Está consciente e estável hemodinamicamente.",
      patientData: {
        paciente: { Idade: "68 anos", Sexo: "Masculino" },
        história: { DM2: "Sim", HAS: "Sim", DRC: "Sim (perda persistente da função renal)" },
        medicações: { Losartana: "Em uso", Espironolactona: "Em uso" },
        sinaisVitais: { PA: "138/84 mmHg", FC: "96 bpm", Estado: "Consciente" },
        laboratório: { "K⁺": { valor: "6,8 mEq/L", alerta: "alto" } },
      },
      prompt: "Qual é o melhor primeiro passo?",
      options: [
        {
          id: "a",
          label: "Repetir o potássio urgentemente e aguardar o novo resultado antes de decidir a conduta",
          isBest: false,
          nextId: "dead_wait",
          feedback:
            "Pseudohipercalemia existe, mas essa escolha é incompleta. O paciente tem sintomas e fatores de risco; esperar sem ECG e sem monitorização é perigoso.",
        },
        {
          id: "b",
          label: "Pedir ECG à beira-leito, repetir eletrólitos/função renal, revisar medicações e monitorizar o paciente",
          isBest: true,
          nextId: "severity",
          feedback:
            "Esse é o melhor primeiro passo. Você combina confirmação diagnóstica com avaliação imediata de gravidade.",
        },
        {
          id: "c",
          label: "Suspender losartana e espironolactona agora e observar se os sintomas melhoram com a próxima coleta",
          isBest: false,
          nextId: "dead_meds",
          feedback:
            "Rever as medicações faz parte do raciocínio, mas isso não responde à pergunta mais urgente: o potássio já está afetando o coração?",
        },
      ],
    },
    dead_wait: {
      id: "dead_wait",
      kind: "dead_end",
      title: "Beco sem saída: esperar custou tempo",
      icon: "AlertTriangle",
      scene:
        "A equipe espera. O paciente espera. O potássio não espera. Dez minutos depois, o monitor apita — ondas T cada vez mais apiculadas aparecem no traçado. O técnico de enfermagem chama: \"Doutor, ele está piorando.\" Um ECG feito agora teria mostrado isso antes.",
      prompt: "O que fazer a partir desse aprendizado?",
      options: [
        {
          id: "retry",
          label: "Voltar e priorizar ECG, monitorização e confirmação laboratorial ao mesmo tempo",
          nextId: "start",
          feedback:
            "Em hipercalemia suspeita, o raciocínio correto junta gravidade clínica e confirmação diagnóstica desde o início.",
        },
      ],
    },
    dead_meds: {
      id: "dead_meds",
      kind: "dead_end",
      title: "Beco sem saída: raciocínio incompleto",
      icon: "AlertTriangle",
      scene:
        "A equipe debate animadamente a losartana enquanto o paciente continua na maca sem monitor. De repente o residente olha pro lado e pergunta: \"Alguém pediu o ECG?\" Silêncio constrangedor. O coração estava sob risco esse tempo todo.",
      prompt: "Como corrigir a rota?",
      options: [
        {
          id: "retry",
          label: "Voltar e investigar gravidade primeiro, com ECG e monitorização",
          nextId: "start",
          feedback:
            "Antes de discutir a causa final, você precisa saber se existe ameaça imediata ao coração.",
        },
      ],
    },
    severity: {
      id: "severity",
      kind: "decision",
      title: "A pista principal",
      icon: "HeartPulse",
      scene:
        "Você monitora o paciente, repete o exame e recebe os novos dados. A amostra não estava hemolisada. O ECG mostra ondas T apiculadas e início de alargamento do QRS.",
      patientData: {
        laboratório: {
          "K⁺ (repetido)": { valor: "6,7 mEq/L", alerta: "alto" },
          Creatinina: { valor: "2,6 mg/dL", alerta: "alto" },
          Ureia: { valor: "Elevada", alerta: "alto" },
          Hemólise: { valor: "Ausente", alerta: "normal" },
        },
        ecg: {
          "Ondas T": { valor: "Apiculadas", alerta: "alto" },
          QRS: { valor: "Início de alargamento", alerta: "alto" },
        },
      },
      prompt: "Como classificar esse caso agora?",
      options: [
        {
          id: "a",
          label: "Hipercalemia grave verdadeira, com repercussão cardíaca, exigindo tratamento imediato",
          isBest: true,
          nextId: "stabilize",
          feedback:
            "Perfeito. Agora já não é apenas um potássio alto no papel: existe repercussão elétrica e risco de arritmia.",
        },
        {
          id: "b",
          label: "Provável pseudohipercalemia; basta repetir o exame amanhã",
          isBest: false,
          nextId: "dead_pseudo",
          feedback:
            "Isso ignora dois dados fortes: a amostra não estava hemolisada e o ECG já está alterado.",
        },
        {
          id: "c",
          label: "Quadro neuromuscular isolado; o ECG é secundário",
          isBest: false,
          nextId: "dead_neuro",
          feedback:
            "Fraqueza muscular existe, mas o ponto crítico do caso é a repercussão cardíaca.",
        },
      ],
    },
    dead_pseudo: {
      id: "dead_pseudo",
      kind: "dead_end",
      title: "Beco sem saída: você chamou de pseudo o que era grave",
      icon: "AlertTriangle",
      scene:
        "\"Deve ser erro de coleta\" — e a equipe segue em frente. Dois minutos depois, o monitor dispara. O QRS alargou mais. O residente entra em pânico e grita: \"Chama o cardiologista!\" A amostra não estava hemolisada. Nunca foi pseudo.",
      prompt: "Qual correção salva o caso?",
      options: [
        {
          id: "back",
          label: "Voltar e reconhecer que K⁺ 6,7 + ECG alterado = hipercalemia grave verdadeira",
          nextId: "severity",
          feedback:
            "Quando o ECG e o contexto clínico apontam para hipercalemia, o tempo importa.",
        },
      ],
    },
    dead_neuro: {
      id: "dead_neuro",
      kind: "dead_end",
      title: "Beco sem saída: foco no sintoma errado",
      icon: "AlertTriangle",
      scene:
        "A equipe pede avaliação da neurologia para a fraqueza. Enquanto isso, o monitor apita mansinho ao fundo — ninguém olha. O QRS já está largo demais. A fraqueza muscular era consequência; o coração era a urgência.",
      prompt: "Como retomar o raciocínio correto?",
      options: [
        {
          id: "back",
          label: "Voltar e priorizar a repercussão cardíaca como principal sinal de gravidade",
          nextId: "severity",
          feedback:
            "Na hipercalemia, o coração determina a urgência do caso.",
        },
      ],
    },
    stabilize: {
      id: "stabilize",
      kind: "decision",
      title: "Primeira decisão terapêutica",
      icon: "Activity",
      scene:
        "Você já reconheceu uma hipercalemia com alterações no ECG. Agora precisa escolher a intervenção inicial que mais reduz o risco imediato de morte.",
      prompt: "Qual é a melhor primeira medida?",
      options: [
        {
          id: "a",
          label: "Gluconato de cálcio EV",
          isBest: true,
          nextId: "shift",
          feedback:
            "Correto. O cálcio não baixa o potássio, mas estabiliza a membrana miocárdica e compra tempo.",
        },
        {
          id: "b",
          label: "Restringir alimentos ricos em potássio",
          isBest: false,
          nextId: "dead_diet",
          feedback:
            "Dieta é assunto posterior. Neste momento, ela não protege o paciente do risco arrítmico agudo.",
        },
        {
          id: "c",
          label: "Aguardar a nefrologia antes de qualquer medida",
          isBest: false,
          nextId: "dead_wait_specialist",
          feedback:
            "Esperar ajuda especializada sem iniciar a estabilização imediata pode ser perigoso.",
        },
      ],
    },
    dead_diet: {
      id: "dead_diet",
      kind: "dead_end",
      title: "Beco sem saída: conduta certa, hora errada",
      icon: "AlertTriangle",
      scene:
        "A nutricionista é acionada. O cardápio sem banana está sendo preparado. Enquanto isso, o monitor apita — o coração não recebeu nenhuma proteção. A dieta é importante, mas não salva ninguém em fibrilação ventricular.",
      prompt: "Como corrigir a prioridade?",
      options: [
        {
          id: "back",
          label: "Voltar e proteger o miocárdio imediatamente",
          nextId: "stabilize",
          feedback:
            "Na hipercalemia com ECG alterado, a primeira tarefa é estabilizar o coração.",
        },
      ],
    },
    dead_wait_specialist: {
      id: "dead_wait_specialist",
      kind: "dead_end",
      title: "Beco sem saída: você esperou demais",
      icon: "AlertTriangle",
      scene:
        "O telefone toca na nefrologia. Toca de novo. O nefrologista está em outra interconsulta. Enquanto isso, o monitor dispara — QRS alargando, ritmo instável. O residente olha pro attending com olhos arregalados. A burocracia do plantão não pausa a hipercalemia.",
      prompt: "Qual medida deveria ter sido iniciada já?",
      options: [
        {
          id: "back",
          label: "Voltar e administrar cálcio EV para estabilização cardíaca",
          nextId: "stabilize",
          feedback:
            "O primeiro passo terapêutico precisa acontecer ali, à beira-leito.",
        },
      ],
    },
    shift: {
      id: "shift",
      kind: "decision",
      title: "Baixar rápido o potássio",
      icon: "FlaskConical",
      scene:
        "Após o cálcio EV, o coração está mais protegido, mas o K⁺ continua alto. Agora é hora de reduzir rapidamente o potássio sérico nas próximas horas.",
      prompt: "Qual opção faz mais sentido agora?",
      options: [
        {
          id: "a",
          label: "Insulina com glicose e considerar beta-2 agonista inalatório",
          isBest: true,
          nextId: "cause",
          feedback:
            "Correto. Essas medidas deslocam o potássio para dentro da célula e reduzem o K⁺ sérico rapidamente.",
        },
        {
          id: "b",
          label: "Começar apenas antibiótico e observar",
          isBest: false,
          nextId: "dead_antibiotic",
          feedback:
            "Não há foco infeccioso como prioridade, e isso não trata a hipercalemia.",
        },
        {
          id: "c",
          label: "Dar soro fisiológico sem outro plano",
          isBest: false,
          nextId: "dead_saline",
          feedback:
            "Volume isolado não resolve o problema principal e não reduz o potássio com a velocidade necessária.",
        },
      ],
    },
    dead_antibiotic: {
      id: "dead_antibiotic",
      kind: "dead_end",
      title: "Beco sem saída: você tratou outro problema",
      icon: "AlertTriangle",
      scene:
        "Amoxicilina prescrita. O farmacêutico dispensa. O soro com antibiótico começa a correr. O K⁺ continua em 6,7. O monitor apita. O residente pergunta: \"Mas cadê o foco infeccioso?\" Não tinha. E o potássio não caiu um milímetro.",
      prompt: "Qual era a meta fisiológica correta?",
      options: [
        {
          id: "back",
          label: "Voltar e usar medidas que desloquem K⁺ para dentro da célula",
          nextId: "shift",
          feedback:
            "Nesta etapa, a prioridade é baixar o K⁺ sérico rapidamente.",
        },
      ],
    },
    dead_saline: {
      id: "dead_saline",
      kind: "dead_end",
      title: "Beco sem saída: suporte sem estratégia",
      icon: "AlertTriangle",
      scene:
        "O soro fisiológico pinga. Pinga. Pinga. O K⁺ continua em 6,7. O monitor apita de novo. \"Tá hidratado, pelo menos\", alguém murmura. O coração discorda — e mostra isso com mais um alargamento do QRS.",
      prompt: "Como voltar ao objetivo certo?",
      options: [
        {
          id: "back",
          label: "Voltar e escolher terapia que reduza o potássio sérico rapidamente",
          nextId: "shift",
          feedback:
            "Você precisa de uma medida com efeito rápido sobre o K⁺ circulante.",
        },
      ],
    },
    cause: {
      id: "cause",
      kind: "decision",
      title: "Fechando o diagnóstico",
      icon: "BrainCircuit",
      scene:
        "O paciente melhora parcialmente após as medidas iniciais. Agora falta integrar causa, diagnóstico e mecanismo fisiopatológico principal.",
      prompt: "Qual diagnóstico integra melhor esse caso?",
      options: [
        {
          id: "a",
          label: "Hipercalemia grave verdadeira por menor excreção renal de K⁺ na DRC, agravada por losartana e espironolactona, com repercussão cardíaca",
          isBest: true,
          nextId: "success",
          feedback:
            "Exatamente. O caso combina retenção de potássio por disfunção renal com medicamentos que reduzem sua excreção, além de ECG compatível.",
        },
        {
          id: "b",
          label: "Pseudohipercalemia por erro de coleta, sem relevância clínica imediata",
          isBest: false,
          nextId: "dead_final_pseudo",
          feedback:
            "Isso contradiz o contexto todo: amostra sem hemólise, K⁺ elevado e alterações no ECG.",
        },
        {
          id: "c",
          label: "Excesso isolado de ingestão alimentar de potássio em um paciente com função renal normal",
          isBest: false,
          nextId: "dead_final_diet",
          feedback:
            "Dieta isolada raramente explica hipercalemia grave nesse contexto, ainda mais com DRC e medicamentos poupadores de potássio.",
        },
      ],
    },
    dead_final_pseudo: {
      id: "dead_final_pseudo",
      kind: "dead_end",
      title: "Beco sem saída: você perdeu o diagnóstico",
      icon: "AlertTriangle",
      scene:
        "\"Pseudohipercalemia\" é escrito no prontuário com confiança. O interno vai tomar café. O monitor continua apitando na sala. A enfermeira entra correndo: \"O senhor da 3 não está bem.\" Era o mesmo paciente. O ECG estava alterado esse tempo todo.",
      prompt: "Quer reavaliar o diagnóstico final?",
      options: [
        {
          id: "back",
          label: "Voltar e integrar rim, medicamentos, potássio e ECG",
          nextId: "cause",
          feedback:
            "O diagnóstico correto precisa explicar todo o caso ao mesmo tempo.",
        },
      ],
    },
    dead_final_diet: {
      id: "dead_final_diet",
      kind: "dead_end",
      title: "Beco sem saída: explicação simplista demais",
      icon: "AlertTriangle",
      scene:
        "\"Comeu banana demais\" — e o diagnóstico é encerrado. O residente anota no prontuário: \"orientação dietética realizada\". O attending franze a testa e olha pro ECG. Tem DRC, tem losartana, tem espironolactona, tem QRS largo. Isso não é banana.",
      prompt: "Como fechar o diagnóstico de forma completa?",
      options: [
        {
          id: "back",
          label: "Voltar e priorizar a menor excreção renal de K⁺ como mecanismo central",
          nextId: "cause",
          feedback:
            "O mecanismo principal aqui é retenção de potássio, não ingestão isolada.",
        },
      ],
    },
    success: {
      id: "success",
      kind: "success",
      title: "Diagnóstico correto",
      icon: "CheckCircle2",
      scene:
        "Vocês fecharam o caso. Trata-se de hipercalemia grave verdadeira, com repercussão cardíaca no ECG, em um paciente com DRC e uso de losartana + espironolactona, o que favorece retenção de potássio por menor excreção renal.",
      prompt: "O que vocês gostariam de fazer agora?",
      options: [
        {
          id: "restart",
          label: "Recomeçar o caso",
          nextId: "start",
          feedback:
            "Ótimo. Dá para jogar de novo e testar escolhas diferentes com a sala.",
        },
      ],
    },
  },
};

export default hipercalemiaCase;
