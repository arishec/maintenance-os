'use client';

import { useState, useEffect } from 'react';

/* ── Scenario data ─────────────────────────────────────────────── */

interface Scenario {
  photo: { emoji: string; bg: string; label: string };
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
    photo: { emoji: '💧', bg: 'from-blue-100 to-blue-300', label: 'ceiling_leak.jpg' },
    issue: 'Water stain on ceiling, spreading fast — about 2 feet wide now',
    analysis: {
      category: 'Water Damage',
      urgency: 'High',
      urgencyColor: 'text-red-600 bg-red-50 border-red-200',
      trade: 'Plumbing',
      description:
        'Photo shows active water damage on ceiling drywall with brownish staining spreading approximately 2 feet in diameter. Pattern indicates a slow leak from above — likely a supply line, drain pipe, or roof penetration. Immediate inspection recommended to prevent mold growth and structural compromise.',
    },
  },
  {
    photo: { emoji: '❄️', bg: 'from-cyan-100 to-cyan-300', label: 'hvac_unit.jpg' },
    issue: 'AC stopped blowing cold air yesterday, just warm air now',
    analysis: {
      category: 'HVAC — Cooling',
      urgency: 'High',
      urgencyColor: 'text-red-600 bg-red-50 border-red-200',
      trade: 'HVAC Technician',
      description:
        'Photo shows exterior condenser unit with visible frost buildup on refrigerant lines — a strong indicator of low refrigerant or a failing expansion valve. Combined with warm air output, this suggests a refrigerant leak. Schedule same-day service to prevent compressor damage.',
    },
  },
  {
    photo: { emoji: '🔌', bg: 'from-amber-100 to-amber-300', label: 'breaker_panel.jpg' },
    issue: 'Kitchen outlets stopped working, breaker keeps tripping',
    analysis: {
      category: 'Electrical',
      urgency: 'High',
      urgencyColor: 'text-red-600 bg-red-50 border-red-200',
      trade: 'Electrician',
      description:
        'Photo shows breaker panel with the kitchen circuit in tripped position. Repeated trips indicate a circuit overload, short circuit, or ground fault — this is a potential fire hazard. Do not continue resetting. A licensed electrician should inspect the circuit, outlets, and wiring.',
    },
  },
  {
    photo: { emoji: '🚰', bg: 'from-emerald-100 to-emerald-300', label: 'faucet_drip.jpg' },
    issue: 'Bathroom faucet won\'t stop dripping, getting worse over weeks',
    analysis: {
      category: 'Plumbing — Fixture',
      urgency: 'Medium',
      urgencyColor: 'text-amber-600 bg-amber-50 border-amber-200',
      trade: 'Plumber',
      description:
        'Photo shows mineral buildup around the faucet base and handle, consistent with a long-term drip. Likely cause is a worn cartridge or O-ring inside the valve body. A plumber can replace the cartridge in under an hour — this will also reduce your water bill, as a steady drip wastes up to 3,000 gallons per year.',
    },
  },
];

/* ── Animation phases ──────────────────────────────────────────── */

type Phase = 'photo' | 'scanning' | 'typing' | 'analyzing' | 'category' | 'urgency' | 'trade' | 'description' | 'done';

const PHASE_ORDER: Phase[] = ['photo', 'scanning', 'typing', 'analyzing', 'category', 'urgency', 'trade', 'description', 'done'];

export function AIDemoHero() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('photo');
  const [typedChars, setTypedChars] = useState(0);
  const [descChars, setDescChars] = useState(0);
  const [fading, setFading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const scenario = scenarios[scenarioIdx];

  /* ── Photo appear phase ────────────────────────────────── */
  useEffect(() => {
    if (phase !== 'photo') return;
    const t = setTimeout(() => setPhase('scanning'), 600);
    return () => clearTimeout(t);
  }, [phase]);

  /* ── Scanning effect ───────────────────────────────────── */
  useEffect(() => {
    if (phase !== 'scanning') return;
    if (scanProgress >= 100) {
      const t = setTimeout(() => setPhase('typing'), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setScanProgress((p) => Math.min(p + 4, 100)), 30);
    return () => clearTimeout(t);
  }, [phase, scanProgress]);

  /* ── Typing effect for issue text ──────────────────────── */
  useEffect(() => {
    if (phase !== 'typing') return;
    if (typedChars >= scenario.issue.length) {
      const t = setTimeout(() => setPhase('analyzing'), 400);
      return () => clearTimeout(t);
    }
    const char = scenario.issue[typedChars];
    const delay = char === ' ' ? 20 : char === ',' || char === '—' ? 80 : 35;
    const t = setTimeout(() => setTypedChars((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [phase, typedChars, scenario.issue]);

  /* ── Phase progression ─────────────────────────────────── */
  useEffect(() => {
    if (phase === 'photo' || phase === 'scanning' || phase === 'typing' || phase === 'done') return;

    const delays: Record<string, number> = {
      analyzing: 800,
      category: 600,
      urgency: 600,
      trade: 600,
      description: 0,
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
        setPhase('photo');
        setTypedChars(0);
        setDescChars(0);
        setScanProgress(0);
        setFading(false);
      }, 500);
    }, 3000);
    return () => clearTimeout(t);
  }, [phase]);

  const phaseIdx = PHASE_ORDER.indexOf(phase);
  const showPhoto = phaseIdx >= PHASE_ORDER.indexOf('photo');
  const isScanning = phase === 'scanning';
  const scanDone = phaseIdx > PHASE_ORDER.indexOf('scanning');
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

          {/* Photo + Issue input area */}
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-start gap-4">
              {/* Photo with scan effect */}
              <div className="flex-shrink-0">
                <div
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br ${scenario.photo.bg} flex items-center justify-center text-4xl sm:text-5xl overflow-hidden transition-all duration-500 ${
                    showPhoto ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  }`}
                >
                  {scenario.photo.emoji}
                  {/* Scan line overlay */}
                  {isScanning && (
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-blue-500/70 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                      style={{ top: `${scanProgress}%`, transition: 'top 30ms linear' }}
                    />
                  )}
                  {/* Scan complete checkmark */}
                  {scanDone && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                      <div className="bg-emerald-500 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm font-bold shadow-md">
                        ✓
                      </div>
                    </div>
                  )}
                </div>
                {/* Filename */}
                <div className={`mt-1.5 text-[10px] text-center text-slate-400 font-mono transition-opacity duration-300 ${showPhoto ? 'opacity-100' : 'opacity-0'}`}>
                  📎 {scenario.photo.label}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {/* Scanning status */}
                {(isScanning || phase === 'photo') && (
                  <div className="mb-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      AI scanning photo...
                    </div>
                    <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-100"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Issue text */}
                {scanDone && (
                  <>
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                      Repair issue + photo
                    </div>
                    <p className="text-sm sm:text-base text-slate-800 leading-relaxed">
                      {scenario.issue.slice(0, typedChars)}
                      {phase === 'typing' && (
                        <span className="inline-block w-0.5 h-5 bg-blue-500 align-text-bottom animate-pulse ml-0.5" />
                      )}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* AI Analysis area */}
          <div className="p-5 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${
                isAnalyzing ? 'bg-blue-500 animate-pulse'
                : isScanning ? 'bg-blue-500 animate-pulse'
                : phaseIdx >= PHASE_ORDER.indexOf('category') ? 'bg-emerald-500'
                : 'bg-slate-300'
              }`} />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isScanning
                  ? 'AI scanning photo...'
                  : isAnalyzing
                  ? 'AI analyzing issue + photo...'
                  : phaseIdx >= PHASE_ORDER.indexOf('category')
                  ? 'AI Analysis Complete — photo + text'
                  : 'Waiting for input...'}
              </span>
            </div>

            {/* Results grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
              {/* Category */}
              <div
                className={`rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3 transition-all duration-300 ${
                  showCategory ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Category
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800">
                  {showCategory ? scenario.analysis.category : ''}
                </div>
              </div>

              {/* Urgency */}
              <div
                className={`rounded-xl border bg-white p-2.5 sm:p-3 transition-all duration-300 ${
                  showUrgency
                    ? `opacity-100 translate-y-0 ${scenario.analysis.urgencyColor}`
                    : 'opacity-0 translate-y-2 border-slate-200'
                }`}
              >
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Urgency
                </div>
                <div className="text-xs sm:text-sm font-bold">
                  {showUrgency ? scenario.analysis.urgency : ''}
                </div>
              </div>

              {/* Trade */}
              <div
                className={`rounded-xl border border-slate-200 bg-white p-2.5 sm:p-3 transition-all duration-300 ${
                  showTrade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                  Trade
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800">
                  {showTrade ? scenario.analysis.trade : ''}
                </div>
              </div>
            </div>

            {/* Description */}
            <div
              className={`rounded-xl border border-slate-200 bg-white p-3 sm:p-4 transition-all duration-300 ${
                showDesc ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                AI Assessment — from photo + description
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
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
