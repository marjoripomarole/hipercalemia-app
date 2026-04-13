"use client";
// @ts-nocheck

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  HeartPulse,
  FlaskConical,
  BrainCircuit,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Activity,
} from "lucide-react";

const nodes = {
  start: {
    id: "start",
    kind: "decision",
    title: "Pronto atendimento: começo do caso",
    icon: Stethoscope,
    scene:
      "Paciente de 68 anos, com diabetes, DRC (doença renal crônica, ou seja, perda persistente da função dos rins) e hipertensão, chega ao pronto atendimento com fraqueza muscular, náuseas e palpitações. Usa losartana e espironolactona. Está consciente, PA 138/84 mmHg, FC 96 bpm.",
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
    icon: AlertTriangle,
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
    icon: AlertTriangle,
    scene:
      "A equipe debate animadamente a losartana enquanto o paciente continua no maca sem monitor. De repente o residente olha pro lado e pergunta: \"Alguém pediu o ECG?\" Silêncio constrangedor. O coração estava sob risco todo esse tempo.",
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
    icon: HeartPulse,
    scene:
      "Você monitora o paciente, repete o exame e recebe os dados: K⁺ 6,7 mEq/L, creatinina 2,6 mg/dL, ureia elevada. A amostra não estava hemolisada. O ECG mostra ondas T apiculadas e início de alargamento do QRS.",
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
    icon: AlertTriangle,
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
    icon: AlertTriangle,
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
    icon: Activity,
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
    icon: AlertTriangle,
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
    icon: AlertTriangle,
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
    icon: FlaskConical,
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
    icon: AlertTriangle,
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
    icon: AlertTriangle,
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
    icon: BrainCircuit,
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
    icon: AlertTriangle,
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
    icon: AlertTriangle,
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
    icon: CheckCircle2,
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
};

const scoredDecisionIds = ["start", "severity", "stabilize", "shift", "cause"];

function ScoreBadge({ score, total }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Decisões certas</div>
          <div className="text-2xl font-semibold text-slate-900">{score}/{total}</div>
        </div>
        <div className="text-sm font-medium text-slate-500">{pct}%</div>
      </div>
      <Progress value={pct} className="h-2.5" />
    </div>
  );
}

function KindBadge({ kind }) {
  const styles = {
    decision: "bg-slate-100 text-slate-700",
    dead_end: "bg-rose-100 text-rose-700",
    success: "bg-emerald-100 text-emerald-700",
  };

  const labels = {
    decision: "Decisão clínica",
    dead_end: "Beco sem saída",
    success: "Diagnóstico fechado",
  };

  return (
    <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${styles[kind]}`}>
      {labels[kind]}
    </div>
  );
}

export default function HyperkalemiaRPGGame() {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [path, setPath] = useState(["start"]);
  const [answers, setAnswers] = useState({});

  const currentNode = nodes[currentNodeId];
  const selectedOption = currentNode.options.find((option) => option.id === selectedOptionId);
  const Icon = currentNode.icon;

  const score = useMemo(() => {
    return scoredDecisionIds.reduce((acc, nodeId) => {
      const node = nodes[nodeId];
      const selectedId = answers[nodeId];
      const option = node.options.find((item) => item.id === selectedId);
      return acc + (option?.isBest ? 1 : 0);
    }, 0);
  }, [answers]);

  const stepNumber = scoredDecisionIds.indexOf(currentNodeId) + 1;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const key = e.key.toLowerCase();

      if (!revealed) {
        const idx = ["a", "b", "c"].indexOf(key);
        if (idx !== -1 && idx < currentNode.options.length) {
          setSelectedOptionId(currentNode.options[idx].id);
          return;
        }
      }

      if (e.key === "Enter") {
        if (!revealed && selectedOptionId) {
          if (currentNode.kind === "decision") {
            setAnswers((prev) => ({ ...prev, [currentNodeId]: selectedOptionId }));
          }
          setRevealed(true);
        } else if (revealed && selectedOption) {
          advance();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [revealed, selectedOptionId, currentNode, currentNodeId, selectedOption]);

  const choose = (optionId) => {
    if (revealed) return;
    setSelectedOptionId(optionId);
  };

  const reveal = () => {
    if (!selectedOptionId) return;

    if (currentNode.kind === "decision") {
      setAnswers((prev) => ({ ...prev, [currentNodeId]: selectedOptionId }));
    }

    setRevealed(true);
  };

  const advance = () => {
    if (!selectedOption) return;

    if (selectedOption.nextId === "start") {
      setCurrentNodeId("start");
      setSelectedOptionId(null);
      setRevealed(false);
      setPath(["start"]);
      return;
    }

    setCurrentNodeId(selectedOption.nextId);
    setSelectedOptionId(null);
    setRevealed(false);
    setPath((prev) => [...prev, selectedOption.nextId]);
  };

  const reset = () => {
    setCurrentNodeId("start");
    setSelectedOptionId(null);
    setRevealed(false);
    setAnswers({});
    setPath(["start"]);
  };

  const headerTone = {
    decision: "bg-slate-50/80 border-slate-100",
    dead_end: "bg-rose-50 border-rose-100",
    success: "bg-emerald-50 border-emerald-100",
  };

  const pathPreview = path.slice(-6).map((nodeId) => nodes[nodeId].title);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6">
          <Card className="rounded-[28px] border-0 bg-white shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 mb-4">
                    Seminário de Medicina • Hipercalemia
                  </div>
                  <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
                    Quem salva esse paciente?
                  </h1>
                  <p className="mt-4 text-base md:text-lg leading-8 text-slate-600">
                    Agora o caso funciona como uma árvore de decisão: escolhas erradas continuam o jogo, mas levam a consequências clínicas e becos sem saída.
                  </p>
                </div>

                <div className="w-full lg:w-[320px] space-y-3">
                  <Button variant="outline" onClick={reset} className="w-full rounded-2xl h-11 text-base">
                    <RotateCcw className="w-4 h-4 mr-2" /> Recomeçar
                  </Button>
                  <ScoreBadge score={score} total={scoredDecisionIds.length} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-0 bg-white shadow-sm">
            <CardContent className="p-4 md:p-5">
              <div className="flex flex-wrap gap-2">
                {path.slice(-6).map((nodeId, index, arr) => (
                  <div
                    key={`${nodeId}-${index}`}
                    className={`rounded-full px-3 py-2 text-sm ${index === arr.length - 1 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
                  >
                    {nodes[nodeId].title}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-0 bg-white shadow-sm overflow-hidden">
            <div className={`border-b px-6 py-5 md:px-8 ${headerTone[currentNode.kind]}`}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="rounded-2xl bg-white p-3 shadow-sm border border-slate-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    {stepNumber > 0 && (
                      <div className="text-sm text-slate-500 mb-1">Etapa {stepNumber} de {scoredDecisionIds.length}</div>
                    )}
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{currentNode.title}</h2>
                  </div>
                </div>
                <KindBadge kind={currentNode.kind} />
              </div>
            </div>

            <CardContent className="p-6 md:p-8 space-y-8">
              <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 md:p-6">
                  <div className="text-sm font-medium text-slate-500 mb-2">Situação clínica</div>
                  <div className="text-base md:text-lg leading-8 text-slate-800">{currentNode.scene}</div>
                </div>

                <div className="rounded-3xl bg-white border border-slate-200 p-5 md:p-6">
                  <div className="text-sm font-medium text-slate-500 mb-2">Próxima decisão</div>
                  <div className="text-lg md:text-xl font-semibold leading-8 text-slate-900">{currentNode.prompt}</div>
                </div>
              </div>

              <div className="grid gap-4">
                {currentNode.options.map((option, idx) => {
                  const isSelected = selectedOptionId === option.id;
                  const showSuccess = revealed && option.id === selectedOptionId && option.isBest;
                  const showFailure = revealed && option.id === selectedOptionId && currentNode.kind === "decision" && !option.isBest;

                  return (
                    <button
                      key={option.id}
                      onClick={() => choose(option.id)}
                      className={`group text-left rounded-3xl border px-5 py-5 transition-all ${isSelected ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                        } ${showSuccess ? "ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50" : ""} ${showFailure ? "ring-2 ring-rose-500 border-rose-300 bg-rose-50" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${showSuccess
                            ? "border-emerald-500 bg-emerald-100 text-emerald-700"
                            : showFailure
                              ? "border-rose-500 bg-rose-100 text-rose-700"
                              : isSelected
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-300 bg-white text-slate-500 group-hover:border-slate-400"
                            }`}
                        >
                          {showSuccess ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : showFailure ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            String.fromCharCode(65 + idx)
                          )}
                        </div>
                        <div className="text-base leading-7 text-slate-800">{option.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">
                  {selectedOptionId ? "Resposta selecionada. Revele a consequência clínica antes de avançar." : "Escolha uma opção para continuar."}
                  <span className="ml-2 text-slate-400 hidden sm:inline">· Use A/B/C e Enter</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button onClick={reveal} disabled={!selectedOptionId || revealed} className="rounded-2xl h-11 px-5">
                    Revelar consequência
                  </Button>
                  <Button variant="outline" onClick={advance} disabled={!revealed || !selectedOption} className="rounded-2xl h-11 px-5">
                    {selectedOption?.nextId === "success"
                      ? "Fechar diagnóstico"
                      : currentNode.kind === "dead_end"
                        ? "Voltar para a árvore"
                        : "Seguir caminho"}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {revealed && selectedOption && (
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="rounded-3xl border-0 bg-slate-50 shadow-none">
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-slate-500 mb-2">Leitura da escolha</div>
                      <div className="text-base leading-8 text-slate-800">{selectedOption.feedback}</div>
                    </CardContent>
                  </Card>
                  <Card
                    className={`rounded-3xl border-0 shadow-none ${selectedOption.nextId === "success"
                      ? "bg-emerald-900 text-white"
                      : nodes[selectedOption.nextId].kind === "dead_end"
                        ? "bg-rose-900 text-white"
                        : "bg-slate-900 text-white"
                      }`}
                  >
                    <CardContent className="p-6">
                      <div className="text-sm font-medium text-slate-300 mb-2">Para onde esse caminho leva</div>
                      <div className="text-base leading-8 text-slate-100">{nodes[selectedOption.nextId].title}</div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
