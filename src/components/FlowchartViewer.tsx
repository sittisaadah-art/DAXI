import React from 'react';

interface FlowchartViewerProps {
  type?: 'max3' | 'payment_machine';
  interactive?: boolean;
}

export const FlowchartViewer: React.FC<FlowchartViewerProps> = ({ type = 'max3' }) => {
  if (type === 'payment_machine') {
    return (
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 my-3 text-white overflow-x-auto shadow-inner">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-700/60">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Diagram Alir: Mesin Pembayaran Otomatis
          </span>
          <span className="text-[11px] text-slate-400">Standar ISO 5807</span>
        </div>
        <svg
          viewBox="0 0 520 480"
          className="w-full max-w-lg mx-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker id="arrow-pm" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* START */}
          <rect x="180" y="10" width="160" height="38" rx="19" fill="#065f46" stroke="#34d399" strokeWidth="2" />
          <text x="260" y="34" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">START</text>

          <line x1="260" y1="48" x2="260" y2="78" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-pm)" />

          {/* INPUT */}
          <polygon points="130,80 390,80 360,122 100,122" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
          <text x="245" y="100" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">INPUT total_pembayaran,</text>
          <text x="245" y="115" fill="#93c5fd" fontSize="11" textAnchor="middle">jumlah_uang_dibayarkan</text>

          <line x1="245" y1="122" x2="245" y2="155" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-pm)" />

          {/* DECISION */}
          <polygon points="245,155 385,205 245,255 105,205" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
          <text x="245" y="200" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">jumlah_uang_dibayarkan</text>
          <text x="245" y="215" fill="#fde68a" fontSize="11" fontWeight="bold" textAnchor="middle">&gt;= total_pembayaran ?</text>

          {/* YES BRANCH (LEFT / RIGHT) */}
          {/* YES -> right */}
          <path d="M 385 205 L 430 205 L 430 270" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-pm)" fill="none" />
          <text x="405" y="198" fill="#4ade80" fontSize="11" fontWeight="bold">YA</text>

          {/* NO -> left */}
          <path d="M 105 205 L 60 205 L 60 270" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-pm)" fill="none" />
          <text x="75" y="198" fill="#f87171" fontSize="11" fontWeight="bold">TIDAK</text>

          {/* PROCESS YES */}
          <rect x="350" y="272" width="160" height="42" rx="4" fill="#1f2937" stroke="#38bdf8" strokeWidth="2" />
          <text x="430" y="290" fill="#ffffff" fontSize="10" textAnchor="middle">kembalian =</text>
          <text x="430" y="304" fill="#93c5fd" fontSize="10" textAnchor="middle">uang_bayar - total_bayar</text>

          {/* OUTPUT YES */}
          <polygon points="360,336 500,336 480,374 340,374" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
          <text x="420" y="358" fill="#ffffff" fontSize="11" fontWeight="600" textAnchor="middle">TAMPILKAN kembalian</text>

          <line x1="430" y1="314" x2="430" y2="334" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-pm)" />

          {/* OUTPUT NO */}
          <polygon points="10,272 165,272 145,324 0,324" fill="#450a0a" stroke="#f87171" strokeWidth="1.5" />
          <text x="82" y="293" fill="#ffffff" fontSize="10" fontWeight="600" textAnchor="middle">TAMPILKAN</text>
          <text x="82" y="310" fill="#fca5a5" fontSize="9" textAnchor="middle">"Uang kurang"</text>

          {/* REJOIN TO END */}
          <path d="M 420 374 L 420 415 L 260 415" stroke="#38bdf8" strokeWidth="2" fill="none" />
          <path d="M 75 324 L 75 415 L 260 415" stroke="#38bdf8" strokeWidth="2" fill="none" />
          <line x1="260" y1="415" x2="260" y2="435" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow-pm)" />

          {/* END */}
          <rect x="180" y="437" width="160" height="38" rx="19" fill="#831843" stroke="#f43f5e" strokeWidth="2" />
          <text x="260" y="461" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">END</text>
        </svg>
      </div>
    );
  }

  // Default: Soal 2 flowchart (Mencari Bilangan Terbesar dari bil1, bil2, bil3)
  return (
    <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 my-3 text-white overflow-x-auto shadow-lg">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-700/60">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
          Flowchart Soal No. 2: Algoritma Mencari Bilangan Terbesar
        </span>
        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
          Informatika Bab 2
        </span>
      </div>

      <svg
        viewBox="0 0 540 570"
        className="w-full max-w-lg mx-auto select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
          </marker>
        </defs>

        {/* 1. START */}
        <rect x="195" y="8" width="150" height="36" rx="18" fill="#047857" stroke="#10b981" strokeWidth="2" />
        <text x="270" y="31" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">START</text>

        {/* Arrow to Input */}
        <line x1="270" y1="44" x2="270" y2="72" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* 2. INPUT */}
        <polygon points="140,74 400,74 370,116 110,116" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
        <text x="255" y="99" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">
          INPUT bil1, bil2, bil3
        </text>

        {/* Arrow to Decision 1 */}
        <line x1="255" y1="116" x2="270" y2="148" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* 3. DECISION 1: bil1 > bil2 */}
        <polygon points="270,150 380,195 270,240 160,195" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
        <text x="270" y="199" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
          bil1 &gt; bil2 ?
        </text>

        {/* Branches D1 */}
        {/* TRUE (Right): max = bil1 */}
        <path d="M 380 195 L 435 195 L 435 240" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" fill="none" />
        <text x="395" y="188" fill="#4ade80" fontSize="11" fontWeight="bold">YA (True)</text>
        <rect x="365" y="242" width="140" height="38" rx="4" fill="#1f2937" stroke="#34d399" strokeWidth="2" />
        <text x="435" y="265" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">max = bil1</text>

        {/* FALSE (Left): max = bil2 */}
        <path d="M 160 195 L 105 195 L 105 240" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" fill="none" />
        <text x="110" y="188" fill="#f87171" fontSize="11" fontWeight="bold">TIDAK (False)</text>
        <rect x="35" y="242" width="140" height="38" rx="4" fill="#1f2937" stroke="#f87171" strokeWidth="2" />
        <text x="105" y="265" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">max = bil2</text>

        {/* Rejoin below D1 */}
        <path d="M 435 280 L 435 305 L 270 305" stroke="#38bdf8" strokeWidth="2" fill="none" />
        <path d="M 105 280 L 105 305 L 270 305" stroke="#38bdf8" strokeWidth="2" fill="none" />
        <line x1="270" y1="305" x2="270" y2="330" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* 4. DECISION 2: bil3 > max */}
        <polygon points="270,332 380,377 270,422 160,377" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
        <text x="270" y="381" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
          bil3 &gt; max ?
        </text>

        {/* Branches D2 */}
        {/* TRUE (Right): max = bil3 */}
        <path d="M 380 377 L 435 377 L 435 415" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" fill="none" />
        <text x="395" y="370" fill="#4ade80" fontSize="11" fontWeight="bold">YA (True)</text>
        <rect x="365" y="417" width="140" height="38" rx="4" fill="#1f2937" stroke="#34d399" strokeWidth="2" />
        <text x="435" y="440" fill="#ffffff" fontSize="12" fontWeight="600" textAnchor="middle">max = bil3</text>

        {/* FALSE (Left): bypass */}
        <path d="M 160 377 L 105 377 L 105 470 L 270 470" stroke="#38bdf8" strokeWidth="2" fill="none" />
        <text x="110" y="370" fill="#f87171" fontSize="11" fontWeight="bold">TIDAK (False)</text>

        {/* Rejoin below D2 */}
        <path d="M 435 455 L 435 470 L 270 470" stroke="#38bdf8" strokeWidth="2" fill="none" />
        <line x1="270" y1="470" x2="270" y2="490" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* 5. OUTPUT max */}
        <polygon points="175,492 365,492 345,528 155,528" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
        <text x="260" y="515" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
          OUTPUT max
        </text>

        {/* Arrow to END */}
        <line x1="260" y1="528" x2="260" y2="540" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* 6. END */}
        <rect x="195" y="542" width="130" height="30" rx="15" fill="#831843" stroke="#f43f5e" strokeWidth="2" />
        <text x="260" y="561" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">END</text>
      </svg>
      <div className="mt-2 text-center text-xs text-slate-400 bg-slate-800/80 rounded px-3 py-1.5 border border-slate-700">
        💡 Telusuri alur: bil1 = 7, bil2 = 4, bil3 = 9. Ikuti arah panah kondisi True/False hingga ke OUTPUT max.
      </div>
    </div>
  );
};
