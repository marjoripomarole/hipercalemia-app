"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HeartPulse,
  FlaskConical,
  BrainCircuit,
  Stethoscope,
  Activity,
} from "lucide-react";

const ICONS = {
  AlertTriangle,
  HeartPulse,
  FlaskConical,
  BrainCircuit,
  CheckCircle2,
  Stethoscope,
  Activity,
};

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

export default function GameEngine({ caseData }) {
  const { meta, initialNodeId, scoredDecisionIds, nodes } = caseData;

  const [currentNodeId, setCurrentNodeId] = useState(initialNodeId);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [path, setPath] = useState([initialNodeId]);
  const [answers, setAnswers] = useState({});

  const currentNode = nodes[currentNodeId];
  const selectedOption = currentNode.options.find((option) => option.id === selectedOptionId);
  const Icon = ICONS[currentNode.icon] ?? AlertTriangle;

  const score = useMemo(() => {
    return scoredDecisionIds.reduce((acc, nodeId) => {
      const node = nodes[nodeId];
      const selectedId = answers[nodeId];
      const option = node.options.find((item) => item.id === selectedId);
      return acc + (option?.isBest ? 1 : 0);
    }, 0);
  }, [answers, scoredDecisionIds, nodes]);

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

    if (selectedOption.nextId === initialNodeId) {
      setCurrentNodeId(initialNodeId);
      setSelectedOptionId(null);
      setRevealed(false);
      setPath([initialNodeId]);
      return;
    }

    setCurrentNodeId(selectedOption.nextId);
    setSelectedOptionId(null);
    setRevealed(false);
    setPath((prev) => [...prev, selectedOption.nextId]);
  };

  const reset = () => {
    setCurrentNodeId(initialNodeId);
    setSelectedOptionId(null);
    setRevealed(false);
    setAnswers({});
    setPath([initialNodeId]);
  };

  const headerTone = {
    decision: "bg-slate-50/80 border-slate-100",
    dead_end: "bg-rose-50 border-rose-100",
    success: "bg-emerald-50 border-emerald-100",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6">
          <Card className="rounded-[28px] border-0 bg-white shadow-sm">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 mb-4">
                    {meta.badge}
                  </div>
                  <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
                    {meta.title}
                  </h1>
                  <p className="mt-4 text-base md:text-lg leading-8 text-slate-600">
                    {meta.description}
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
                      className={`group text-left rounded-3xl border px-5 py-5 transition-all ${
                        isSelected ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70"
                      } ${showSuccess ? "ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50" : ""} ${showFailure ? "ring-2 ring-rose-500 border-rose-300 bg-rose-50" : ""}`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                            showSuccess
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
                    className={`rounded-3xl border-0 shadow-none ${
                      selectedOption.nextId === "success"
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
