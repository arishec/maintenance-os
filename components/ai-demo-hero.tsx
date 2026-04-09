'use client';

import { useState, useEffect, useCallback } from 'react';

/* ── Scenario data ─────────────────────────────────────────────── */

interface Scenario {
  photo: { emoji: string; bg: string };
  issue: string;
  analysis: {
    category: string;
    urgency: string;
    urgencyColor: string;
    trade: string;
    description: string;
  };
}

const scenarios: Scenario[] = [
  {
    photo: { emoji: '💧', bg: 'from-blue-100 to-blue-200' },
    issue: 'Water stain on ceiling, spreading fast — about 2 feet wide now',
    analysis: {
      category: 'Water Damage',
      urgency: 'High',
      urgencyColor: 'text-red-600 bg-red-50 border-red-200',
      trade: 'Plumbing',
      description:
        'Active water damage detected. Brown staining indicates a slow leak above the ceiling — likely from a supply line, drain, or roof penetration. Immediate inspection recommended to prevent mold and structural damage.',
    },
  },
  {
    photo: { emoji: '❄️', bg: 'from-cyan-100 to-cyan-200' },
    issue: 'AC stopped blowing cold air yesterday, just warm air now',
    analysis: {
      category: 'HVAC — Cooling',
      urgency: 'High',
      urgencyColor: 'text-red-600 bg-red-50 border-red-200',
      trade: 'HVAC Technician',
      description:
        'Cooling system failure. Warm air output suggests a refrigerant leak, compressor issue, or failed capacitor. In warm weather this is urgent — schedule same-day or next-day service to prevent further damage to the compressor.',
    },
  },
  {
    photo: { emoji: '🔌', bg: 'from-amber-100 to-amber-200' },
    issue: 'Kitchen outlets stopped working, breaker keeps tripping',
    analysis: {
      category: 'Electrical',
      urgency: 'High',
      urgencyColor: 'text-red-600 bg-red-50 border-red-200',
      trade: 'Electrician',
      description:
        'Repeated breaker trips indicate a circuit overload, short circuit, or ground fault. This is a potential fire hazard. Do not reset repeatedly — have a licensed electrician inspect the circuit, outlets, and panel.',
    },
  },
  {
    photo: { emoji: '🚪', bg: 'from-orange-100 to-orange-200' },
    issue: 'Front door lock is loose, key barely turns anymore',
    analysis: {
      category: 'Lock & Hardware',
      urgency: 'Medium',
      urgencyColor: 'text-amber-600 bg-amber-50 border-amber-200',
      trade: 'Locksmith',
      description:
        'Worn lock mechanism with loose hardware. The cylinder or tailpiece is likely degraded. Recommend replacing the deadbolt and knob set — a locksmith can rekey to match existing keys if the door hardware is standard.',
    },
  },
];

/* ── Animation phases ──────────────────────────────────────────── */

type Phase = 'typing' | 'analyzing' | 'category' | 'urgency' | 'trade' | 'description' | 'done';

const PHASE_ORDER: Phase[] = ['typing', 'analyzing', 'category', 'urgency', 'trade', 'description', 'done'];

export function AIDemoHero() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');
  const [typedChars, setTypedChars] = useState(0);
  const [descChars, setDescChars] = useState(0);
  const [fading, setFading] = useState(false);

  const scenario = scenarios[scenarioIdx];

  /* ── Typing effect for issue text ──────────────────────── */
  useEffect(() => {
    if (phase !== 'typing') return;
    if (typedChars >= scenario.issue.length) {
      const t = setTimeout(() => setPhase('analyzing'), 400);
      return () => clearTimeout(t);
    }
    // Variable speed: faster on spaces, slower on punctuation
    const char = scenario.issue[typedChars];
    const delay = char === ' ' ? 20 : char === ',' || char === '—' ? 80 : 35;
    const t = setTimeout(() => setTypedChars((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [phase, typedChars, scenario.issue]);

  /* ── Phase progression ─────────────────────────────────── */
  useEffect(() => {
    if (phase === 'typing' || phase === 'done') return;

    const delays: Record<string, number> = {
      analyzing: 800,
      category: 600,
      urgency: 600,
      trade: 600,
      description: 0, // description types itself
    };

    const delay = delays[phase] ?? 500;
    if (delay === 0) return;

    const nextIdx = PHASE_ORDER.indexOf(phase) + 1;
    if (nextIdx < PHASE_ORDER.length) {
      const t = setTimeout(() => setPhase(PHASE_ORDER[nextIdx]), delay);
      return () => clearTimeout(t);
    }
  }, [phase]);

  /* ── Typing effect for description ─────────────────────── */
  useEffect(() => {
    if (phase !== 'description') return;
    if (descChars >= scenario.analysis.description.length) {
      const t = setTimeout(() => setPhase('done'), 600);
      return () => clearTimeout(t);
    }
    const char = scenario.analysis.description[descChars];
    const delay = char === ' ' ? 10 : char === '.' ? 60 : 18;
    const t = setTimeout(() => setDescChars((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [phase, descChars, scenario.analysis.description]);

  /* ── Cycle to next scenario ────────────────────────────── */
  useEffect(() => {
    if (phase !== 'done') return;
    const t = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setScenarioIdx((i) => (i + 1) % scenarios.length);
        setPhase('typing');
        setTypedChars(0);
        setDescChars(0);
        setFading(false);
      }, 500);
    }, 3000);
    return () => clearTimeout(t);
  }, [phase]);

  const phaseIdx = PHASE_ORDER.indexOf(phase);
  const showCategory = phaseIdx >= PHASE_ORDER.indexOf('category');
  const showUrgency = phaseIdx >= PHASE_ORDER.indexOf('urgency');
  const showTrade = phaseIdx >= PHASE_ORDER.indexOf('trade');
  const showDesc = phaseIdx >= PHASE_ORDER.indexOf('description');
  const isAnalyzing = phase === 'analyzing';

  return (
    <div className={`transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="mx-auto max-w-2xl">
        {/* ── Card ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          {/* Issue input area */}
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-start gap-4">
              {/* Photo placeholder */}
              <div
                className={`flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br ${scenario.photo.bg} flex items-center justify-center text-3xl`}
              >
                {scenario.photo.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                  Repair issue
                </div>
                <p className="text-base text-slate-800 leading-relaxed">
                  {scenario.issue.slice(0, typedChars)}
                  {phase === 'typing' && (
                    <span className="inline-block w-0.5 h-5 bg-blue-500 align-text-bottom animate-pulse ml-0.5" />
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* AI Analysis area */}
          <div className="p-5 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-blue-500 animate-pulse' : phaseIdx > 1 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isAnalyzing ? 'AI analyzing...' : phaseIdx > 1 ? 'AI Analysis Complete' : 'Waiting for input...'}
              </span>
            </div>

            {/* Results grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Category */}
              <div
                className={`rounded-xl border border-slate-200 bg-white p-3 transition-all duration-300 ${
                  showCategory ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Category
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  {showCategory ? scenario.analysis.category : ''}
                </div>
              </div>

              {/* Urgency */}
              <div
                className={`rounded-xl border bg-white p-3 transition-all duration-300 ${
                  showUrgency
                    ? `opacity-100 translate-y-0 ${scenario.analysis.urgencyColor}`
                    : 'opacity-0 translate-y-2 border-slate-200'
                }`}
              >
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Urgency
                </div>
                <div className={`text-sm font-bold ${showUrgency ? '' : ''}`}>
                  {showUrgency ? scenario.analysis.urgency : ''}
                </div>
              </div>

              {/* Trade */}
              <div
                className={`rounded-xl border border-slate-200 bg-white p-3 transition-all duration-300 ${
                  showTrade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Trade
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  {showTrade ? scenario.analysis.trade : ''}
                </div>
              </div>
            </div>

            {/* Description */}
            <div
              className={`rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 ${
                showDesc ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                AI Assessment
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {showDesc ? scenario.analysis.description.slice(0, descChars) : ''}
                {phase === 'description' && (
                  <span className="inline-block w-0.5 h-4 bg-blue-500 align-text-bottom animate-pulse ml-0.5" />
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Scenario dots */}
        <div className="flex justify-center gap-2 mt-5">
          {scenarios.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                i === scenarioIdx ? 'bg-blue-500' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
