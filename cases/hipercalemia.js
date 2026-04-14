const hipercalemiaCase = {
  id: "hipercalemia",
  meta: {
    badge: "Seminário de Medicina • Hipercalemia",
    title: "Quem salva esse paciente?",
    description:
      "Agora o caso funciona como uma árvore de decisão: escolhas erradas continuam o jogo, mas levam a consequências clínicas e becos sem saída.",
  },
  initialNodeId: "start",
  scoredDecisionIds: ["start", "severity", "stabilize", "shift", "eliminate", "cause"],
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
        laboratório: {
          "K⁺": { valor: "6,8 mEq/L", alerta: "alto", referencia: "3,5 – 5,0 mEq/L" },
        },
      },
      prompt: "Qual é o melhor primeiro passo?",
      options: [
        {
          id: "a",
          label: "Repetir o potássio urgentemente e aguardar o novo resultado antes de decidir a conduta",
          isBest: false,
          nextId: "dead_wait",
          feedback:
            "Pseudohipercalemia existe, mas essa escolha é incompleta. O paciente tem sintomas e fatores de risco; esperar sem ECG e sem monitoração é perigoso.",
        },
        {
          id: "b",
          label: "Pedir ECG à beira-leito, repetir eletrólitos/função renal, revisar medicações e monitorar o paciente",
          isBest: true,
          nextId: "severity",
          feedback:
            "Esse é o melhor primeiro passo. Você combina confirmação diagnóstica com avaliação imediata de gravidade. O ECG é a ferramenta mais rápida para detectar repercussão cardíaca da hipercalemia.",
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
          label: "Voltar e priorizar ECG, monitoração e confirmação laboratorial ao mesmo tempo",
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
          label: "Voltar e investigar gravidade primeiro, com ECG e monitoração",
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
      teachingNote:
        "Progressão típica no ECG da hipercalemia: ondas T apiculadas → achatamento da onda P → alargamento do QRS → onda sinusoidal → fibrilação ventricular / assistolia. Cada passo é mais perigoso que o anterior.",
      patientData: {
        laboratório: {
          "K⁺ (repetido)": { valor: "6,7 mEq/L", alerta: "alto", referencia: "3,5 – 5,0 mEq/L" },
          Creatinina: { valor: "2,6 mg/dL", alerta: "alto", referencia: "0,7 – 1,3 mg/dL" },
          "TFGe (CKD-EPI)": { valor: "~22 mL/min/1,73m²", alerta: "alto", referencia: "> 90 mL/min" },
          Ureia: { valor: "128 mg/dL", alerta: "alto", referencia: "15 – 40 mg/dL" },
          "pH arterial": { valor: "7,31", alerta: "alto", referencia: "7,35 – 7,45" },
          "HCO₃⁻": { valor: "18 mEq/L", alerta: "alto", referencia: "22 – 26 mEq/L" },
          Hemólise: { valor: "Ausente", alerta: "normal" },
        },
        ecg: {
          "Ondas T": { valor: "Apiculadas (simétricas, em V2-V6)", alerta: "alto" },
          QRS: { valor: "Início de alargamento (~130 ms)", alerta: "alto" },
          "Onda P": { valor: "Achatada", alerta: "alto" },
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
            "Perfeito. K⁺ > 6,0 mEq/L com alterações no ECG define hipercalemia grave com repercussão cardíaca. Note também a acidose metabólica (pH 7,31, HCO₃⁻ 18) — a acidose desloca K⁺ para fora da célula, piorando o quadro. Existe risco real de arritmia.",
        },
        {
          id: "b",
          label: "Provável pseudohipercalemia; basta repetir o exame amanhã",
          isBest: false,
          nextId: "dead_pseudo",
          feedback:
            "Isso ignora dois dados fortes: a amostra não estava hemolisada e o ECG já está alterado. Pseudohipercalemia ocorre quando há hemólise, leucocitose extrema ou trombocitose — nenhuma presente aqui.",
        },
        {
          id: "c",
          label: "Quadro neuromuscular isolado; o ECG é secundário",
          isBest: false,
          nextId: "dead_neuro",
          feedback:
            "Fraqueza muscular existe, mas o ponto crítico do caso é a repercussão cardíaca. O ECG nunca é \"secundário\" na hipercalemia — ele determina a urgência.",
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
        "Você já reconheceu uma hipercalemia com alterações no ECG. Agora precisa escolher a intervenção inicial que mais reduz o risco imediato de morte. Lembre-se: o monitor cardíaco deve permanecer ligado continuamente.",
      teachingNote:
        "O gluconato de cálcio NÃO reduz o potássio sérico. Ele age elevando o potencial limiar dos cardiomiócitos, tornando o miocárdio menos excitável e mais resistente aos efeitos arritmogênicos do K⁺. O efeito começa em 1-3 minutos e dura 30-60 minutos.",
      prompt: "Qual é a melhor primeira medida?",
      options: [
        {
          id: "a",
          label: "Gluconato de cálcio 10% EV (10 mL em 2-3 minutos)",
          isBest: true,
          nextId: "shift",
          feedback:
            "Correto. O cálcio não baixa o potássio, mas estabiliza a membrana miocárdica ao elevar o potencial limiar dos cardiomiócitos, reduzindo a excitabilidade cardíaca. Dose: 10 mL de gluconato de cálcio 10% EV em 2-3 min. Pode repetir em 5-10 min se as alterações no ECG persistirem.",
        },
        {
          id: "b",
          label: "Insulina regular 10 UI + glicose 50% 50 mL EV antes de qualquer outra medida",
          isBest: false,
          nextId: "dead_sequence",
          feedback:
            "Insulina + glicose é uma medida correta para deslocar K⁺ para dentro da célula, mas não é a PRIMEIRA medida. Antes de baixar o potássio, você precisa proteger o coração. E se ocorrer uma arritmia nesses primeiros minutos?",
        },
        {
          id: "c",
          label: "Aguardar a nefrologia antes de qualquer medida",
          isBest: false,
          nextId: "dead_wait_specialist",
          feedback:
            "Esperar ajuda especializada sem iniciar a estabilização imediata pode ser perigoso. Você deve iniciar o tratamento E chamar a nefrologia simultaneamente para avaliar necessidade de hemodiálise.",
        },
      ],
    },
    dead_sequence: {
      id: "dead_sequence",
      kind: "dead_end",
      title: "Beco sem saída: sequência invertida",
      icon: "AlertTriangle",
      scene:
        "A insulina é prescrita. A farmácia prepara. A enfermeira administra. Tudo certo — exceto a ordem. Enquanto o K⁺ lentamente começa a migrar para dentro das células (efeito em 15-30 min), o coração continua desprotegido. O QRS alarga mais um pouco. O ECG dispara alarme. Se o cálcio tivesse vindo primeiro, o coração estaria protegido nesses minutos críticos.",
      prompt: "Qual deveria ser a primeira medida?",
      options: [
        {
          id: "back",
          label: "Voltar e proteger o miocárdio ANTES de deslocar potássio",
          nextId: "stabilize",
          feedback:
            "Na hipercalemia com ECG alterado, a sequência é: primeiro ESTABILIZAR (cálcio), depois DESLOCAR (insulina + glicose).",
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
            "O primeiro passo terapêutico precisa acontecer ali, à beira-leito. Inicie o tratamento E chame a nefrologia ao mesmo tempo — nunca um em vez do outro.",
        },
      ],
    },
    shift: {
      id: "shift",
      kind: "decision",
      title: "Baixar rápido o potássio",
      icon: "FlaskConical",
      scene:
        "Após o cálcio EV, o coração está mais protegido, mas o K⁺ continua alto. Agora é hora de deslocar o potássio do sangue para dentro das células, reduzindo o K⁺ sérico nas próximas 1-2 horas.",
      teachingNote:
        "A insulina ativa a bomba Na⁺/K⁺-ATPase nas células musculares e hepáticas, empurrando K⁺ para dentro da célula. O efeito começa em 15-30 min e reduz o K⁺ em ~0,5-1,2 mEq/L. O salbutamol nebulizado (β2-agonista) tem efeito semelhante via outro mecanismo (ativação de AMPc → estímulo da Na⁺/K⁺-ATPase).",
      prompt: "Qual opção faz mais sentido agora?",
      options: [
        {
          id: "a",
          label: "Insulina regular 10 UI + glicose 50% (50 mL) EV, associada a salbutamol nebulizado (10-20 mg)",
          isBest: true,
          nextId: "eliminate",
          feedback:
            "Correto. A insulina ativa a bomba Na⁺/K⁺-ATPase, deslocando K⁺ para dentro das células (efeito em 15-30 min, reduz K⁺ em ~0,5-1,2 mEq/L). O salbutamol nebulizado tem efeito aditivo. ⚠️ ATENÇÃO: monitore a glicemia capilar a cada 1-2h por pelo menos 6h — hipoglicemia é uma complicação frequente e perigosa dessa combinação.",
        },
        {
          id: "b",
          label: "Bicarbonato de sódio 8,4% EV isoladamente como medida principal",
          isBest: false,
          nextId: "dead_bicarb",
          feedback:
            "O bicarbonato de sódio tem papel controverso na hipercalemia. Pode ajudar se houver acidose metabólica grave (pH < 7,20), mas como medida ISOLADA para shift de K⁺, sua eficácia é inconsistente e muito mais lenta que insulina + β2-agonista. Não deve ser a medida principal.",
        },
        {
          id: "c",
          label: "Furosemida EV em dose alta para eliminar o potássio na urina",
          isBest: false,
          nextId: "dead_furosemide_early",
          feedback:
            "Furosemida promove a excreção renal de K⁺ (eliminação), mas esse paciente tem uma taxa de filtração glomerular estimada (TFGe) de ~22 mL/min — a resposta ao diurético será limitada. Além disso, essa é uma medida de ELIMINAÇÃO, não de SHIFT. Neste momento, precisamos de algo que mova K⁺ para dentro das células rapidamente.",
        },
      ],
    },
    dead_bicarb: {
      id: "dead_bicarb",
      kind: "dead_end",
      title: "Beco sem saída: medida fraca como protagonista",
      icon: "AlertTriangle",
      scene:
        "O bicarbonato é prescrito. Uma hora depois, o K⁺ de controle volta: 6,5 mEq/L. Quase nada mudou. O attending suspira: \"Bicarbonato isolado? Em que guideline você viu isso funcionar rápido?\" O paciente precisava de insulina — e não recebeu.",
      prompt: "Qual seria a medida de shift mais eficaz?",
      options: [
        {
          id: "back",
          label: "Voltar e usar insulina + glicose com β2-agonista como medidas de shift",
          nextId: "shift",
          feedback:
            "Para deslocar K⁺ para dentro das células, insulina + glicose é a medida de primeira linha, com β2-agonista como adjuvante.",
        },
      ],
    },
    dead_furosemide_early: {
      id: "dead_furosemide_early",
      kind: "dead_end",
      title: "Beco sem saída: certo conceito, fase errada",
      icon: "AlertTriangle",
      scene:
        "A furosemida corre EV. Passam-se 2 horas. O débito urinário aumentou um pouco, mas o K⁺ de controle voltou: 6,4 mEq/L. Com uma taxa de filtração glomerular estimada (TFGe) de 22 mL/min, o rim mal consegue responder. Enquanto isso, as medidas de shift — que poderiam ter agido em 30 minutos — não foram prescritas.",
      prompt: "Qual era o objetivo nesta fase?",
      options: [
        {
          id: "back",
          label: "Voltar e usar medidas que desloquem K⁺ para dentro das células primeiro",
          nextId: "shift",
          feedback:
            "A furosemida é útil na fase de ELIMINAÇÃO, mas o passo atual exige SHIFT rápido. A sequência importa: Estabilizar → Deslocar → Eliminar.",
        },
      ],
    },
    eliminate: {
      id: "eliminate",
      kind: "decision",
      title: "Tirando o potássio do corpo",
      icon: "FlaskConical",
      scene:
        "O cálcio protegeu o coração. A insulina + glicose e o salbutamol estão deslocando K⁺ para dentro das células. Mas essas medidas são temporárias — o potássio vai voltar ao sangue nas próximas horas. Agora você precisa ELIMINAR o potássio do corpo de forma definitiva. Lembre-se: a taxa de filtração glomerular estimada (TFGe) é de ~22 mL/min e monitoração de glicemia capilar a cada 1-2h já está prescrita.",
      teachingNote:
        "As medidas de shift (insulina, β2-agonista) são temporárias — duram 4-6h. Se você não eliminar o K⁺ do corpo, ele retorna ao sangue. As vias de eliminação são: renal (diuréticos — limitada na DRC), gastrointestinal (resinas trocadoras como poliestirenossulfonato de sódio, patiromer, ou ciclossilicato de zircônio) e extracorpórea (hemodiálise — a mais eficaz).",
      prompt: "Qual é a melhor estratégia de eliminação neste paciente?",
      options: [
        {
          id: "a",
          label: "Avaliar indicação de hemodiálise de urgência (DRC com TFGe ~22 mL/min) e associar resina trocadora de K⁺ enquanto aguarda",
          isBest: true,
          nextId: "cause",
          feedback:
            "Correto. Com uma TFGe (taxa de filtração glomerular estimada) de ~22 mL/min, a capacidade renal de excretar K⁺ é muito limitada. A hemodiálise é o método mais eficaz e rápido para remover K⁺ do corpo em pacientes com DRC avançada. Enquanto se organiza a diálise, a resina trocadora de K⁺ (poliestirenossulfonato ou patiromer) pode ajudar pela via gastrointestinal. Furosemida pode ser tentada como adjuvante, mas a resposta será limitada.",
        },
        {
          id: "b",
          label: "O K⁺ já entrou nas células — não precisa de mais nada, basta observar e repetir exames amanhã",
          isBest: false,
          nextId: "dead_observe",
          feedback:
            "As medidas de shift são TEMPORÁRIAS (duram 4-6 horas). O K⁺ que entrou nas células vai voltar ao sangue. Sem eliminação definitiva, a hipercalemia vai recorrer — possivelmente de madrugada, quando a equipe está reduzida.",
        },
        {
          id: "c",
          label: "Mais insulina + glicose em doses repetidas como estratégia principal, sem eliminar K⁺ do corpo",
          isBest: false,
          nextId: "dead_repeat_shift",
          feedback:
            "Repetir medidas de shift sem eliminar o K⁺ do corpo é como esvaziar um barco furado com um balde — funciona momentaneamente, mas o potássio vai voltar. Além disso, doses repetidas de insulina aumentam muito o risco de hipoglicemia grave.",
        },
      ],
    },
    dead_observe: {
      id: "dead_observe",
      kind: "dead_end",
      title: "Beco sem saída: falsa segurança",
      icon: "AlertTriangle",
      scene:
        "\"K⁺ de controle: 5,8. Melhorou!\" A equipe comemora. O plantão vira noite. Às 3h da manhã, o alarme do monitor dispara — K⁺ 6,9 mEq/L. O efeito da insulina acabou e o potássio voltou ao sangue. O paciente estava sem resina, sem diálise, sem nada. O plantonista noturno pergunta: \"Quem mandou não eliminar?\"",
      prompt: "O que estava faltando no plano?",
      options: [
        {
          id: "back",
          label: "Voltar e usar medidas de eliminação definitiva (hemodiálise, resinas)",
          nextId: "eliminate",
          feedback:
            "Shift sem eliminação é medida temporária. O K⁺ SEMPRE volta. A eliminação completa o tratamento.",
        },
      ],
    },
    dead_repeat_shift: {
      id: "dead_repeat_shift",
      kind: "dead_end",
      title: "Beco sem saída: mais insulina, mais risco",
      icon: "AlertTriangle",
      scene:
        "Terceira dose de insulina prescrita. Glicemia capilar: 42 mg/dL. O paciente começa a suar frio, tremer e ficar confuso. A hipoglicemia iatrogênica chegou antes do controle definitivo do K⁺. A enfermeira administra glicose de resgate enquanto o K⁺ continua oscilando. O attending aparece: \"Isso não é tratamento — é enxugar gelo.\"",
      prompt: "Qual era a estratégia correta?",
      options: [
        {
          id: "back",
          label: "Voltar e associar medidas de eliminação definitiva ao plano",
          nextId: "eliminate",
          feedback:
            "A estratégia correta após o shift é a ELIMINAÇÃO: hemodiálise (a mais eficaz na DRC), resinas trocadoras de K⁺, e diuréticos de alça como adjuvantes.",
        },
      ],
    },
    cause: {
      id: "cause",
      kind: "decision",
      title: "Fechando o diagnóstico",
      icon: "BrainCircuit",
      scene:
        "O paciente melhora parcialmente após as medidas iniciais. A nefrologia está avaliando a indicação de diálise. Agora falta integrar causa, diagnóstico e mecanismo fisiopatológico principal.",
      teachingNote:
        "Mecanismo-chave: a Losartana bloqueia o receptor AT1 da angiotensina II → menor estímulo para liberação de aldosterona. A Espironolactona bloqueia diretamente o receptor de aldosterona no ducto coletor. Resultado combinado: o ducto coletor não secreta K⁺ adequadamente. Some isso à DRC (menos néfrons funcionantes para excretar K⁺) e você tem a tempestade perfeita.",
      prompt: "Qual diagnóstico integra melhor esse caso?",
      options: [
        {
          id: "a",
          label: "Hipercalemia grave verdadeira por menor excreção renal de K⁺ na DRC, agravada por duplo bloqueio do SRAA (losartana + espironolactona), com repercussão cardíaca e acidose metabólica",
          isBest: true,
          nextId: "success",
          feedback:
            "Exatamente. O caso combina: (1) retenção de K⁺ por disfunção renal (TFGe ~22 mL/min), (2) duplo bloqueio do SRAA — losartana reduz aldosterona via bloqueio de AT1, e espironolactona bloqueia o receptor mineralocorticoide no ducto coletor, ambos reduzindo a excreção de K⁺, (3) acidose metabólica que desloca K⁺ para fora das células, e (4) ECG com repercussão cardíaca confirmando gravidade.",
        },
        {
          id: "b",
          label: "Pseudohipercalemia por erro de coleta, sem relevância clínica imediata",
          isBest: false,
          nextId: "dead_final_pseudo",
          feedback:
            "Isso contradiz o contexto todo: amostra sem hemólise, K⁺ elevado confirmado na repetição e alterações no ECG. Pseudohipercalemia requer causa identificável (hemólise, leucocitose extrema, torniquete prolongado).",
        },
        {
          id: "c",
          label: "Excesso isolado de ingestão alimentar de potássio em um paciente com função renal normal",
          isBest: false,
          nextId: "dead_final_diet",
          feedback:
            "Dieta isolada raramente explica hipercalemia grave nesse contexto. A função renal NÃO é normal (TFGe ~22 mL/min), e há dois medicamentos que bloqueiam o SRAA. O mecanismo principal é retenção, não ingestão.",
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
            "O mecanismo principal aqui é retenção de potássio por DRC + bloqueio duplo do SRAA, não ingestão isolada.",
        },
      ],
    },
    success: {
      id: "success",
      kind: "success",
      title: "Diagnóstico correto — caso encerrado!",
      icon: "CheckCircle2",
      scene:
        "Vocês fecharam o caso. Trata-se de hipercalemia grave verdadeira, com repercussão cardíaca no ECG, em um paciente com DRC (taxa de filtração glomerular estimada ~22 mL/min) e uso de losartana + espironolactona (duplo bloqueio do SRAA), favorecendo retenção de potássio por menor excreção renal. A acidose metabólica concomitante agravava o quadro deslocando K⁺ para fora das células.",
      summary: {
        title: "📋 Revisão: Protocolo C-A-S-E da Hipercalemia",
        steps: [
          {
            letter: "C",
            word: "Cálcio",
            detail:
              "Gluconato de cálcio 10% EV — estabiliza a membrana cardíaca (não baixa o K⁺). Efeito em 1-3 min.",
          },
          {
            letter: "A",
            word: "Albuterol + Insulina",
            detail:
              "Insulina 10 UI + Glicose 50% + Salbutamol nebulizado — desloca K⁺ para dentro das células (shift). Efeito em 15-30 min. ⚠️ Monitorar glicemia!",
          },
          {
            letter: "S",
            word: "Saída do K⁺",
            detail:
              "Hemodiálise (mais eficaz na DRC), resinas trocadoras (poliestirenossulfonato, patiromer), diuréticos de alça — remove K⁺ do corpo (eliminação definitiva).",
          },
          {
            letter: "E",
            word: "Etiologia",
            detail:
              "Investigar e tratar a causa: DRC + bloqueio do SRAA (losartana + espironolactona) → suspender medicações causadoras, ajustar doses, acompanhar com nefrologia.",
          },
        ],
      },
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
