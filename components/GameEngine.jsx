"use client";

import React, { useMemo, useState, useEffect } from "react";
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
  Skull,
  Shield,
  Swords,
  ClipboardList,
  FileHeart,
  BookOpen,
  GraduationCap,
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

/* ═══════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════ */

function HpBar({ score, total }) {
  const pct = Math.round((score / total) * 100);
  const barColor = pct >= 60 ? "bg-emerald-500" : pct >= 30 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="flex items-center gap-2.5">
      <div className="font-pixel text-[9px] text-emerald-800 whitespace-nowrap">
        <Shield className="w-3.5 h-3.5 inline mr-1 mb-0.5 text-emerald-700" />
        HP
      </div>
      <div className="w-28 h-4 bg-amber-100 border-2 border-amber-800/40 relative overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-pixel text-[7px] text-amber-950 drop-shadow-[0_1px_0px_rgba(255,255,255,0.4)]">
            {score}/{total}
          </span>
        </div>
      </div>
    </div>
  );
}

function KindBadge({ kind }) {
  const config = {
    decision: {
      bg: "bg-sky-100 border-sky-700/40",
      text: "text-sky-800",
      label: "⚔ Decisão clínica",
    },
    dead_end: {
      bg: "bg-red-100 border-red-700/40",
      text: "text-red-800",
      label: "💀 Beco sem saída",
    },
    success: {
      bg: "bg-emerald-100 border-emerald-700/40",
      text: "text-emerald-800",
      label: "✦ Diagnóstico fechado",
    },
  };

  const c = config[kind];

  return (
    <div className={`inline-flex items-center border-2 px-2.5 py-1 font-pixel text-[8px] ${c.bg} ${c.text}`}>
      {c.label}
    </div>
  );
}

const SECTION_LABELS = {
  paciente: { label: "PACIENTE", icon: "user" },
  "história": { label: "HISTÓRIA", icon: "history" },
  "medicações": { label: "MEDICAÇÕES", icon: "meds" },
  sinaisVitais: { label: "SINAIS VITAIS", icon: "vitals" },
  "laboratório": { label: "LABORATÓRIO", icon: "lab" },
  ecg: { label: "ECG", icon: "ecg" },
};

function LabPanel({ data }) {
  if (!data) return null;

  return (
    <div className="rpg-border-cyan bg-[#f0f7fa] p-3">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList className="w-3.5 h-3.5 text-sky-700" />
        <div className="font-pixel text-[8px] text-sky-700 uppercase tracking-widest">
          Prontuário
        </div>
      </div>
      <div className="space-y-2.5">
        {Object.entries(data).map(([sectionKey, sectionData]) => {
          const sectionInfo = SECTION_LABELS[sectionKey] || { label: sectionKey.toUpperCase() };
          return (
            <div key={sectionKey}>
              <div className="font-pixel text-[6px] text-sky-600/70 uppercase tracking-[0.15em] mb-1 border-b border-sky-300/30 pb-0.5">
                {sectionInfo.label}
              </div>
              <div className="space-y-0.5">
                {Object.entries(sectionData).map(([key, value]) => {
                  const isStructured = typeof value === "object" && value.valor;
                  const displayValue = isStructured ? value.valor : value;
                  const alert = isStructured ? value.alerta : null;
                  const referencia = isStructured ? value.referencia : null;

                  return (
                    <div key={key} className="px-1.5 py-0.5 text-xs font-sans">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#3d2e1e]/70 shrink-0">{key}</span>
                        <span className={`text-right font-medium ${
                          alert === "alto" ? "text-red-700" :
                          alert === "normal" ? "text-emerald-700" :
                          "text-[#3d2e1e]"
                        }`}>
                          {alert === "alto" && "⚠ "}
                          {displayValue}
                        </span>
                      </div>
                      {referencia && (
                        <div className="text-[10px] text-[#3d2e1e]/40 text-right mt-0.5 italic">
                          ref: {referencia}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeachingNote({ note }) {
  const [open, setOpen] = useState(false);
  if (!note) return null;

  return (
    <div className="rpg-border bg-[#faf6ef] p-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-amber-50/50 transition-colors"
      >
        <GraduationCap className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="font-pixel text-[8px] text-amber-700 uppercase tracking-widest">
          Nota do Professor
        </span>
        <span className="ml-auto font-pixel text-[8px] text-amber-600/60">
          {open ? "▲ FECHAR" : "▼ ABRIR"}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-3 border-t border-amber-700/10">
          <div className="mt-2.5 text-sm leading-7 text-amber-900/80 font-sans">
            <BookOpen className="w-3.5 h-3.5 inline mr-1.5 mb-0.5 text-amber-600" />
            {note}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryPanel({ summary }) {
  if (!summary) return null;

  return (
    <div className="rpg-border-gold bg-gradient-to-br from-amber-50 to-[#fdf8ef] p-4">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="w-4 h-4 text-amber-700" />
        <div className="font-pixel text-[9px] text-amber-800 uppercase tracking-widest">
          {summary.title}
        </div>
      </div>
      <div className="grid gap-2.5">
        {summary.steps.map((step) => (
          <div
            key={step.letter}
            className="flex gap-3 items-start bg-white/60 border-2 border-amber-700/15 p-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-amber-600/40 bg-amber-100 font-pixel text-[12px] text-amber-800">
              {step.letter}
            </div>
            <div>
              <div className="font-pixel text-[9px] text-amber-800 mb-0.5">
                {step.word}
              </div>
              <div className="text-xs leading-6 text-[#3d2e1e]/80 font-sans">
                {step.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN GAME ENGINE
   ═══════════════════════════════════════════ */

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
    decision: "bg-sky-50 border-sky-300/60",
    dead_end: "bg-red-50 border-red-300/60",
    success: "bg-emerald-50 border-emerald-300/60",
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f0e6d3] text-[#2a1f14] relative scanlines">

      {/* Subtle pixel grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,111,71,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,111,71,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative z-10 h-full max-w-5xl mx-auto px-3 py-3 md:px-5 md:py-4 flex flex-col gap-3">

        {/* ── TOP BAR ── */}
        <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rpg-border bg-[#faf4eb] px-4 py-3">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-5 h-5 text-red-600 heartbeat" />
            <h1 className="font-pixel text-[11px] md:text-[13px] text-emerald-800 leading-relaxed">
              {meta.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <HpBar score={score} total={scoredDecisionIds.length} />
            <button
              onClick={reset}
              className="rpg-border bg-[#faf4eb] hover:bg-emerald-50 px-3 py-1.5 font-pixel text-[8px] text-emerald-800 hover:text-emerald-700 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" /> RESTART
            </button>
          </div>
        </div>

        {/* ── BREADCRUMB PATH ── */}
        <div className="shrink-0 flex flex-wrap gap-1 rpg-border-cyan bg-[#f0f7fa] px-3 py-2">
          {path.slice(-6).map((nodeId, index, arr) => (
            <div
              key={`${nodeId}-${index}`}
              className={`px-2 py-0.5 font-pixel text-[7px] border-2 transition-all ${
                index === arr.length - 1
                  ? "bg-sky-100 border-sky-600/40 text-sky-800"
                  : "bg-transparent border-amber-700/15 text-amber-800/50"
              }`}
            >
              {index === arr.length - 1 ? "► " : "· "}{nodes[nodeId].title}
            </div>
          ))}
        </div>

        {/* ── MAIN GAME PANEL ── */}
        <div className={`min-h-0 flex-1 overflow-hidden flex flex-col ${
          currentNode.kind === "dead_end" ? "rpg-border-danger" : currentNode.kind === "success" ? "rpg-border-gold" : "rpg-border"
        } bg-[#faf4eb]`}>

          {/* Panel header */}
          <div className={`shrink-0 border-b-2 px-4 py-2.5 md:px-5 ${headerTone[currentNode.kind]}`}>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-1.5 border-2 ${
                  currentNode.kind === "dead_end" ? "border-red-600/40 text-red-700 bg-red-50" :
                  currentNode.kind === "success" ? "border-amber-600/40 text-amber-700 bg-amber-50" :
                  "border-sky-600/40 text-sky-700 bg-sky-50"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  {stepNumber > 0 && (
                    <div className="font-pixel text-[7px] text-amber-700/60 mb-0.5">
                      FASE {stepNumber}/{scoredDecisionIds.length}
                    </div>
                  )}
                  <h2 className={`font-pixel text-[10px] md:text-[11px] leading-relaxed ${
                    currentNode.kind === "dead_end" ? "text-red-800" :
                    currentNode.kind === "success" ? "text-amber-800" :
                    "text-sky-800"
                  }`}>
                    {currentNode.title}
                  </h2>
                </div>
              </div>
              <KindBadge kind={currentNode.kind} />
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-5 space-y-4">

            {/* Scene + Lab Panel + Prompt */}
            <div className={`grid gap-3 ${
              currentNode.patientData
                ? "lg:grid-cols-[1fr_0.7fr_0.8fr]"
                : "lg:grid-cols-[1.1fr_0.9fr]"
            }`}>
              {/* Clinical scene */}
              <div className="rpg-border bg-[#f5f0e5] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
                  <div className="font-pixel text-[8px] text-emerald-700 uppercase tracking-widest">
                    Situação clínica
                  </div>
                </div>
                <div className="text-sm leading-7 text-[#3d2e1e] font-sans">
                  {currentNode.scene}
                </div>
              </div>

              {/* Lab panel — only when structured data exists */}
              {currentNode.patientData && (
                <LabPanel data={currentNode.patientData} />
              )}

              {/* Decision prompt */}
              <div className="rpg-border-gold bg-[#fdf8ef] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Swords className="w-3.5 h-3.5 text-amber-700" />
                  <div className="font-pixel text-[8px] text-amber-700 uppercase tracking-widest">
                    Próxima decisão
                  </div>
                </div>
                <div className="text-base font-semibold leading-7 text-[#3d2e1e] font-sans rpg-cursor">
                  {currentNode.prompt}
                </div>
              </div>
            </div>

            {/* Teaching note — professor explanation */}
            <TeachingNote note={currentNode.teachingNote} />

            {/* Summary panel — shown on success screen */}
            {currentNode.kind === "success" && currentNode.summary && (
              <SummaryPanel summary={currentNode.summary} />
            )}

            {/* Options */}
            <div className="grid gap-2">
              {currentNode.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const showSuccess = revealed && option.id === selectedOptionId && option.isBest;
                const showFailure = revealed && option.id === selectedOptionId && currentNode.kind === "decision" && !option.isBest;

                const letter = String.fromCharCode(65 + idx);

                let borderClass = "border-2 border-amber-700/20 bg-[#faf4eb] hover:border-emerald-600/40 hover:bg-emerald-50/50";
                if (isSelected && !revealed) borderClass = "border-2 border-sky-600 bg-sky-50 shadow-[0_2px_0_rgba(14,116,144,0.2)]";
                if (showSuccess) borderClass = "border-2 border-emerald-600 bg-emerald-50 shadow-[0_2px_0_rgba(22,163,74,0.2)]";
                if (showFailure) borderClass = "border-2 border-red-600 bg-red-50 shadow-[0_2px_0_rgba(185,28,28,0.2)]";

                return (
                  <button
                    key={option.id}
                    onClick={() => choose(option.id)}
                    className={`group text-left px-4 py-3 transition-all ${borderClass}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border-2 font-pixel text-[9px] ${
                          showSuccess
                            ? "border-emerald-600 bg-emerald-100 text-emerald-800"
                            : showFailure
                            ? "border-red-600 bg-red-100 text-red-800"
                            : isSelected
                            ? "border-sky-600 bg-sky-100 text-sky-800"
                            : "border-amber-700/25 bg-amber-50 text-amber-800/60 group-hover:border-emerald-600/40 group-hover:text-emerald-700"
                        }`}
                      >
                        {showSuccess ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : showFailure ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          letter
                        )}
                      </div>
                      <div className={`text-sm leading-6 font-sans ${
                        showSuccess ? "text-emerald-900" :
                        showFailure ? "text-red-900" :
                        isSelected ? "text-sky-900" :
                        "text-[#3d2e1e]"
                      }`}>
                        {option.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Action bar */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end border-t-2 border-amber-700/10 pt-3">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={reveal}
                  disabled={!selectedOptionId || revealed}
                  className="rpg-border bg-[#faf4eb] hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-1.5 font-pixel text-[8px] text-emerald-800 hover:text-emerald-700 transition-colors"
                >
                  ⚡ REVELAR
                </button>
                <button
                  onClick={advance}
                  disabled={!revealed || !selectedOption}
                  className="rpg-border-gold bg-[#fdf8ef] hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-1.5 font-pixel text-[8px] text-amber-800 hover:text-amber-700 transition-colors flex items-center gap-1"
                >
                  {selectedOption?.nextId === "success"
                    ? "🏆 FECHAR"
                    : currentNode.kind === "dead_end"
                    ? "↩ VOLTAR"
                    : "▶ SEGUIR"}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Revealed feedback */}
            {revealed && selectedOption && (
              <div className="grid gap-3 md:grid-cols-2">
                <div className={`p-4 ${selectedOption.isBest ? "rpg-border bg-emerald-50/80" : "rpg-border-danger bg-red-50/80"}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedOption.isBest ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-700" />
                    )}
                    <div className={`font-pixel text-[7px] uppercase tracking-widest ${
                      selectedOption.isBest ? "text-emerald-700" : "text-red-700"
                    }`}>
                      {selectedOption.isBest ? "Escolha correta!" : "Escolha inadequada"}
                    </div>
                  </div>
                  <div className={`text-sm leading-7 font-sans ${
                    selectedOption.isBest ? "text-emerald-950" : "text-red-950"
                  }`}>
                    {selectedOption.feedback}
                  </div>
                </div>

                <div className={`p-4 ${
                  selectedOption.nextId === "success"
                    ? "rpg-border-gold bg-amber-50/80"
                    : nodes[selectedOption.nextId].kind === "dead_end"
                    ? "rpg-border-danger bg-red-50/80"
                    : "rpg-border-cyan bg-sky-50/80"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronRight className={`w-3.5 h-3.5 ${
                      selectedOption.nextId === "success" ? "text-amber-700" :
                      nodes[selectedOption.nextId].kind === "dead_end" ? "text-red-700" :
                      "text-sky-700"
                    }`} />
                    <div className={`font-pixel text-[7px] uppercase tracking-widest ${
                      selectedOption.nextId === "success" ? "text-amber-700" :
                      nodes[selectedOption.nextId].kind === "dead_end" ? "text-red-700" :
                      "text-sky-700"
                    }`}>
                      Próximo destino
                    </div>
                  </div>
                  <div className={`text-sm leading-7 font-sans ${
                    selectedOption.nextId === "success" ? "text-amber-950" :
                    nodes[selectedOption.nextId].kind === "dead_end" ? "text-red-950" :
                    "text-sky-950"
                  }`}>
                    {nodes[selectedOption.nextId].title}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
