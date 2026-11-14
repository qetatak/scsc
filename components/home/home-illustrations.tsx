'use client';

import React from 'react';

/**
 * 1) Hero Architectural System Illustration:
 * Desktop/Tablet (>= sm): Compact horizontal flow fitting comfortably in 1440x900 Hero fold.
 * Mobile (< sm): Vertical portrait architectural SVG so every label stays large and legible.
 */
export function HeroSystemIllustration() {
  return (
    <div className="w-full rounded-[20px] border border-[#E3E8F0] bg-white p-3.5 sm:p-5 dark:border-[#1E325C] dark:bg-[#0A1630]">
      {/* Desktop & Tablet Horizontal Architectural Diagram */}
      <svg
        viewBox="0 0 700 264"
        className="hidden h-auto w-full overflow-visible sm:block"
        role="img"
        aria-label="رسم توضيحي لمسار التدريب: أربعة مختبرات تدير شركة افتراضية واحدة وتبني ملفاً مهنياً تراه الشركات"
      >
        <rect
          x="6"
          y="6"
          width="688"
          height="252"
          rx="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-[#E3E8F0] dark:text-[#1E325C]"
        />

        {/* Animated Flow Connectors (Right Labs -> Center Virtual Company) */}
        <path
          d="M 484 44 C 446 44, 444 108, 412 108"
          fill="none"
          stroke="#2F6BFF"
          strokeWidth="1.75"
          className="animate-flow-dash"
        />
        <path
          d="M 484 102 C 450 102, 446 122, 412 122"
          fill="none"
          stroke="#2F6BFF"
          strokeWidth="1.75"
          className="animate-flow-dash"
        />
        <path
          d="M 484 160 C 450 160, 446 142, 412 142"
          fill="none"
          stroke="#2F6BFF"
          strokeWidth="1.75"
          className="animate-flow-dash"
        />
        <path
          d="M 484 218 C 446 218, 444 156, 412 156"
          fill="none"
          stroke="#2F6BFF"
          strokeWidth="1.75"
          className="animate-flow-dash"
        />

        {/* Center -> Left Flow */}
        <path
          d="M 264 118 C 234 118, 230 78, 200 78"
          fill="none"
          stroke="#2F6BFF"
          strokeWidth="1.75"
          className="animate-flow-dash"
        />
        <path
          d="M 264 150 C 234 150, 230 186, 200 186"
          fill="none"
          stroke="#2F6BFF"
          strokeWidth="1.75"
          className="animate-flow-dash"
        />

        {/* RIGHT SIDE: 4 INTERACTIVE LABS */}
        {[
          { y: 21, title: 'مختبر المحاسبة', sub: 'ميزانية متوازنة' },
          { y: 79, title: 'مختبر التسويق', sub: 'نمو الحملة +184%' },
          { y: 137, title: 'مختبر الإدارة', sub: 'نقطة التعادل 250' },
          { y: 195, title: 'مختبر البرمجة', sub: 'تحليل ببايثون' },
        ].map((lab) => (
          <g key={lab.title}>
            <rect
              x="484"
              y={lab.y}
              width="190"
              height="46"
              rx="11"
              className="fill-[#FAFBFC] stroke-[#E3E8F0] dark:fill-[#070D1F] dark:stroke-[#1E325C]"
              strokeWidth="1.5"
            />
            <rect
              x="654"
              y={lab.y + 13}
              width="8"
              height="20"
              rx="4"
              fill="#2F6BFF"
              opacity="0.25"
            />
            <circle cx="484" cy={lab.y + 23} r="4" fill="#2F6BFF" />
            <text
              x="642"
              y={lab.y + 20}
              textAnchor="start"
              fontSize="13"
              fontWeight="700"
              className="fill-[#0A1630] dark:fill-[#FAFBFC]"
            >
              {lab.title}
            </text>
            <text
              x="642"
              y={lab.y + 37}
              textAnchor="start"
              fontSize="12"
              fontWeight="400"
              className="fill-[#475569] dark:fill-[#CBD5E1]"
            >
              {lab.sub}
            </text>
          </g>
        ))}

        {/* CENTER HUB: VIRTUAL COMPANY */}
        <g>
          <rect
            x="264"
            y="58"
            width="148"
            height="148"
            rx="16"
            fill="rgba(47, 107, 255, 0.08)"
            stroke="#2F6BFF"
            strokeWidth="1.75"
          />
          <rect x="280" y="74" width="116" height="28" rx="8" fill="#2F6BFF" />
          <text
            x="338"
            y="92"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="#FFFFFF"
          >
            الشركة الافتراضية
          </text>

          <rect
            x="286"
            y="114"
            width="104"
            height="46"
            rx="10"
            className="fill-white stroke-[#E3E8F0] dark:fill-[#070D1F] dark:stroke-[#1E325C]"
            strokeWidth="1.25"
          />
          <rect x="300" y="133" width="14" height="17" rx="3" fill="#2F6BFF" opacity="0.45" />
          <rect x="320" y="127" width="14" height="23" rx="3" fill="#2F6BFF" opacity="0.7" />
          <rect x="340" y="121" width="14" height="29" rx="3" fill="#2F6BFF" />
          <rect x="360" y="129" width="14" height="21" rx="3" fill="#22C55E" />

          <text
            x="338"
            y="179"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            className="fill-[#0A1630] dark:fill-[#FAFBFC]"
          >
            بيانات حية مترابطة
          </text>
          <text
            x="338"
            y="196"
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="#2F6BFF"
          >
            تحديث فوري
          </text>
        </g>

        {/* LEFT SIDE: STUDENT PROFILE & COMPANIES */}
        <g>
          <rect
            x="26"
            y="30"
            width="174"
            height="94"
            rx="14"
            className="fill-[#FAFBFC] stroke-[#0A1630] dark:fill-[#070D1F] dark:stroke-[#94A3B8]"
            strokeWidth="1.5"
          />
          <circle cx="176" cy="57" r="11" fill="#2F6BFF" opacity="0.16" />
          <circle cx="176" cy="57" r="5" fill="#2F6BFF" />
          <text
            x="156"
            y="61"
            textAnchor="start"
            fontSize="13"
            fontWeight="700"
            className="fill-[#0A1630] dark:fill-[#FAFBFC]"
          >
            ملفك المهني
          </text>
          <rect x="44" y="78" width="138" height="8" rx="4" className="fill-[#E3E8F0] dark:fill-[#1E325C]" />
          <rect x="80" y="78" width="102" height="8" rx="4" fill="#2F6BFF" />
          <text
            x="182"
            y="108"
            textAnchor="start"
            fontSize="12"
            fontWeight="500"
            className="fill-[#475569] dark:fill-[#CBD5E1]"
          >
            نقاط ومهارات موثقة
          </text>
          <circle cx="200" cy="78" r="4" fill="#2F6BFF" />

          <rect
            x="26"
            y="138"
            width="174"
            height="94"
            rx="14"
            className="fill-[#FAFBFC] stroke-[#2F6BFF] dark:fill-[#070D1F]"
            strokeWidth="1.5"
          />
          <rect x="164" y="152" width="22" height="22" rx="6" fill="#22C55E" opacity="0.18" />
          <path
            d="M 170 163 L 174 167 L 181 159"
            fill="none"
            stroke="#22C55E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="156"
            y="168"
            textAnchor="start"
            fontSize="13"
            fontWeight="700"
            className="fill-[#0A1630] dark:fill-[#FAFBFC]"
          >
            تجدك الشركات
          </text>
          <text
            x="182"
            y="194"
            textAnchor="start"
            fontSize="12"
            fontWeight="400"
            className="fill-[#475569] dark:fill-[#CBD5E1]"
          >
            فرز حسب المهارة
          </text>
          <text
            x="182"
            y="214"
            textAnchor="start"
            fontSize="12"
            fontWeight="600"
            fill="#2F6BFF"
          >
            دعوة مقابلة مباشرة
          </text>
          <circle cx="200" cy="186" r="4" fill="#2F6BFF" />
        </g>
      </svg>

      {/* Mobile Portrait Diagram (< sm): Large readable Arabic labels */}
      <svg
        viewBox="0 0 340 310"
        className="block h-auto w-full sm:hidden"
        role="img"
        aria-label="رسم توضيحي لمسار التدريب من المختبرات إلى الشركة الافتراضية ثم ملفك والشركات"
      >
        {/* Top 2x2 Grid: 4 Labs */}
        {[
          { x: 176, y: 10, title: 'مختبر المحاسبة', sub: 'ميزانية متوازنة' },
          { x: 12, y: 10, title: 'مختبر التسويق', sub: 'عائد +184%' },
          { x: 176, y: 74, title: 'مختبر الإدارة', sub: 'تعادل 250 وحدة' },
          { x: 12, y: 74, title: 'مختبر البرمجة', sub: 'تحليل ببايثون' },
        ].map((lab) => (
          <g key={lab.title}>
            <rect
              x={lab.x}
              y={lab.y}
              width="152"
              height="52"
              rx="10"
              className="fill-[#FAFBFC] stroke-[#E3E8F0] dark:fill-[#070D1F] dark:stroke-[#1E325C]"
              strokeWidth="1.5"
            />
            <text
              x={lab.x + 140}
              y={lab.y + 23}
              textAnchor="start"
              fontSize="13"
              fontWeight="700"
              className="fill-[#0A1630] dark:fill-[#FAFBFC]"
            >
              {lab.title}
            </text>
            <text
              x={lab.x + 140}
              y={lab.y + 41}
              textAnchor="start"
              fontSize="12"
              fontWeight="400"
              className="fill-[#475569] dark:fill-[#CBD5E1]"
            >
              {lab.sub}
            </text>
          </g>
        ))}

        {/* Connectors Down to Virtual Company */}
        <line x1="90" y1="126" x2="140" y2="152" stroke="#2F6BFF" strokeWidth="1.75" className="animate-flow-dash" />
        <line x1="250" y1="126" x2="200" y2="152" stroke="#2F6BFF" strokeWidth="1.75" className="animate-flow-dash" />

        {/* Center Hub: Virtual Company */}
        <rect
          x="50"
          y="152"
          width="240"
          height="52"
          rx="12"
          fill="rgba(47, 107, 255, 0.1)"
          stroke="#2F6BFF"
          strokeWidth="1.75"
        />
        <text
          x="170"
          y="175"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#2F6BFF"
        >
          شركتك الافتراضية الموحدة
        </text>
        <text
          x="170"
          y="194"
          textAnchor="middle"
          fontSize="12"
          fontWeight="500"
          className="fill-[#0A1630] dark:fill-[#FAFBFC]"
        >
          تحديث تلقائي في جميع الأقسام
        </text>

        {/* Connectors Down to Profile & Companies */}
        <line x1="140" y1="204" x2="88" y2="230" stroke="#2F6BFF" strokeWidth="1.75" className="animate-flow-dash" />
        <line x1="200" y1="204" x2="252" y2="230" stroke="#2F6BFF" strokeWidth="1.75" className="animate-flow-dash" />

        {/* Bottom Left: Companies */}
        <rect
          x="12"
          y="230"
          width="152"
          height="66"
          rx="12"
          className="fill-[#FAFBFC] stroke-[#2F6BFF] dark:fill-[#070D1F]"
          strokeWidth="1.5"
        />
        <text x="150" y="255" textAnchor="start" fontSize="13" fontWeight="700" className="fill-[#0A1630] dark:fill-[#FAFBFC]">
          تجدك الشركات
        </text>
        <text x="150" y="278" textAnchor="start" fontSize="12" fontWeight="600" fill="#2F6BFF">
          دعوة مقابلة مباشرة
        </text>

        {/* Bottom Right: Student Profile */}
        <rect
          x="176"
          y="230"
          width="152"
          height="66"
          rx="12"
          className="fill-[#FAFBFC] stroke-[#0A1630] dark:fill-[#070D1F] dark:stroke-[#94A3B8]"
          strokeWidth="1.5"
        />
        <text x="314" y="255" textAnchor="start" fontSize="13" fontWeight="700" className="fill-[#0A1630] dark:fill-[#FAFBFC]">
          ملفك المهني
        </text>
        <text x="314" y="278" textAnchor="start" fontSize="12" fontWeight="400" className="fill-[#475569] dark:fill-[#CBD5E1]">
          نقاط ومهارات موثقة
        </text>
      </svg>
    </div>
  );
}

/**
 * 2) Three-Step Illustrations (How It Works)
 */
export function StepTrainIllustration() {
  return (
    <svg viewBox="0 0 240 110" className="h-26 w-full" aria-hidden="true">
      <rect
        x="16"
        y="10"
        width="208"
        height="90"
        rx="12"
        fill="rgba(47, 107, 255, 0.08)"
        stroke="#2F6BFF"
        strokeWidth="1.5"
      />
      <rect x="34" y="26" width="172" height="12" rx="6" fill="rgba(255,255,255,0.12)" />
      <rect x="96" y="26" width="110" height="12" rx="6" fill="#2F6BFF" />
      <rect x="34" y="50" width="76" height="34" rx="8" fill="rgba(255,255,255,0.06)" stroke="#3B82F6" strokeWidth="1.25" />
      <rect x="122" y="50" width="84" height="34" rx="8" fill="rgba(34,197,94,0.14)" stroke="#22C55E" strokeWidth="1.25" />
      <path
        d="M 156 67 L 162 73 L 173 61"
        fill="none"
        stroke="#22C55E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="62" cy="67" r="7.5" fill="none" stroke="#93C5FD" strokeWidth="1.5" />
      <circle cx="82" cy="67" r="7.5" fill="#2F6BFF" opacity="0.55" />
    </svg>
  );
}

export function StepProfileIllustration() {
  return (
    <svg viewBox="0 0 240 110" className="h-26 w-full" aria-hidden="true">
      <rect
        x="16"
        y="10"
        width="208"
        height="90"
        rx="12"
        fill="rgba(47, 107, 255, 0.08)"
        stroke="#2F6BFF"
        strokeWidth="1.5"
      />
      <polygon
        points="68,23 94,38 94,68 68,83 42,68 42,38"
        fill="none"
        stroke="#64748B"
        strokeWidth="1.25"
      />
      <polygon
        points="68,31 89,44 85,66 68,78 49,64 47,42"
        fill="rgba(47, 107, 255, 0.25)"
        stroke="#2F6BFF"
        strokeWidth="1.75"
      />
      <circle cx="68" cy="31" r="3" fill="#2F6BFF" />
      <circle cx="89" cy="44" r="3" fill="#2F6BFF" />
      <circle cx="68" cy="78" r="3" fill="#2F6BFF" />
      <rect x="116" y="30" width="90" height="10" rx="5" fill="rgba(255,255,255,0.12)" />
      <rect x="132" y="30" width="74" height="10" rx="5" fill="#2F6BFF" />
      <rect x="116" y="50" width="90" height="10" rx="5" fill="rgba(255,255,255,0.12)" />
      <rect x="148" y="50" width="58" height="10" rx="5" fill="#60A5FA" />
      <rect x="116" y="70" width="90" height="10" rx="5" fill="rgba(255,255,255,0.12)" />
      <rect x="124" y="70" width="82" height="10" rx="5" fill="#22C55E" />
    </svg>
  );
}

export function StepCompanyIllustration() {
  return (
    <svg viewBox="0 0 240 110" className="h-26 w-full" aria-hidden="true">
      <rect
        x="16"
        y="10"
        width="208"
        height="90"
        rx="12"
        fill="rgba(47, 107, 255, 0.08)"
        stroke="#2F6BFF"
        strokeWidth="1.5"
      />
      <rect x="34" y="24" width="172" height="23" rx="8" fill="rgba(255,255,255,0.08)" stroke="#334155" strokeWidth="1.25" />
      <circle cx="50" cy="35.5" r="5" fill="none" stroke="#93C5FD" strokeWidth="1.5" />
      <line x1="54" y1="39.5" x2="58" y2="43.5" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="110" y="32" width="80" height="7" rx="3.5" fill="#60A5FA" opacity="0.65" />

      <rect x="34" y="57" width="172" height="29" rx="8" fill="rgba(34,197,94,0.12)" stroke="#22C55E" strokeWidth="1.25" />
      <rect x="44" y="63.5" width="54" height="16" rx="6" fill="#2F6BFF" />
      <rect x="114" y="67.5" width="76" height="8" rx="4" fill="#E2E8F0" opacity="0.7" />
    </svg>
  );
}

/**
 * 3) Four Lab Card Live Mini-Previews
 */
export function AccountingScalePreview() {
  return (
    <div className="mt-5 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-[#0A1630] dark:text-[#FAFBFC]">
          الأصول = الخصوم + الملكية
        </span>
        <span className="rounded-[8px] bg-[#22C55E]/15 px-2.5 py-0.5 text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
          الميزانية متوازنة
        </span>
      </div>

      <svg
        viewBox="0 0 360 116"
        className="mt-3 h-auto w-full"
        role="img"
        aria-label="ميزان محاسبي متوازن يتحرك بين الأصول والخصوم وحقوق الملكية"
      >
        <line x1="180" y1="22" x2="180" y2="96" stroke="#2F6BFF" strokeWidth="2" />
        <rect x="136" y="96" width="88" height="8" rx="4" fill="#2F6BFF" opacity="0.25" />
        <circle cx="180" cy="22" r="5" fill="#2F6BFF" />

        <g className="animate-scale-balance">
          <line x1="68" y1="30" x2="292" y2="30" stroke="#2F6BFF" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="274" y1="30" x2="254" y2="66" stroke="currentColor" strokeWidth="1.25" className="text-[#475569] dark:text-[#94A3B8]" />
          <line x1="274" y1="30" x2="294" y2="66" stroke="currentColor" strokeWidth="1.25" className="text-[#475569] dark:text-[#94A3B8]" />
          <rect x="218" y="66" width="112" height="24" rx="8" fill="rgba(47,107,255,0.12)" stroke="#2F6BFF" strokeWidth="1.25" />
          <text x="274" y="82" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-[#0A1630] dark:fill-[#FAFBFC]">
            الأصول 65,000
          </text>

          <line x1="86" y1="30" x2="66" y2="66" stroke="currentColor" strokeWidth="1.25" className="text-[#475569] dark:text-[#94A3B8]" />
          <line x1="86" y1="30" x2="106" y2="66" stroke="currentColor" strokeWidth="1.25" className="text-[#475569] dark:text-[#94A3B8]" />
          <rect x="30" y="66" width="112" height="24" rx="8" fill="rgba(47,107,255,0.12)" stroke="#2F6BFF" strokeWidth="1.25" />
          <text x="86" y="82" textAnchor="middle" fontSize="12" fontWeight="600" className="fill-[#0A1630] dark:fill-[#FAFBFC]">
            الالتزامات 65,000
          </text>
        </g>
      </svg>
    </div>
  );
}

export function MarketingGrowthPreview() {
  return (
    <div className="mt-5 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium text-[#475569] dark:text-[#CBD5E1]">
          نمو عائد الحملة
        </span>
        <span className="font-tabular font-bold text-[#15803D] dark:text-[#4ADE80]">
          +184%
        </span>
      </div>

      <svg
        viewBox="0 0 300 100"
        className="mt-2 h-auto w-full"
        role="img"
        aria-label="مخطط ارتفاع نتائج الحملة التسويقية"
      >
        <line x1="16" y1="84" x2="284" y2="84" stroke="currentColor" strokeWidth="1.25" className="text-[#CBD5E1] dark:text-[#1E325C]" />
        <rect x="32" y="64" width="28" height="20" rx="5" fill="#2F6BFF" opacity="0.25" />
        <rect x="82" y="52" width="28" height="32" rx="5" fill="#2F6BFF" opacity="0.45" />
        <rect x="132" y="42" width="28" height="42" rx="5" fill="#2F6BFF" opacity="0.65" />
        <rect x="182" y="28" width="28" height="56" rx="5" fill="#2F6BFF" opacity="0.85" />
        <rect x="232" y="16" width="28" height="68" rx="5" fill="#2F6BFF" />
        <path
          d="M 46 58 L 96 46 L 146 36 L 196 22 L 246 10"
          fill="none"
          stroke="#22C55E"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
        <circle cx="246" cy="10" r="4" fill="#22C55E" />
      </svg>
    </div>
  );
}

export function ManagementBreakEvenPreview() {
  return (
    <div className="mt-5 rounded-[12px] border border-[#E3E8F0] bg-[#FAFBFC] p-4 dark:border-[#1E325C] dark:bg-[#070D1F]">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium text-[#475569] dark:text-[#CBD5E1]">
          نقطة التعادل
        </span>
        <span className="font-tabular font-bold text-[#2F6BFF]">
          250 وحدة
        </span>
      </div>

      <svg
        viewBox="0 0 300 105"
        className="mt-2 h-auto w-full"
        role="img"
        aria-label="مخطط تقاطع الإيرادات والتكاليف عند نقطة التعادل"
      >
        <line x1="20" y1="88" x2="280" y2="88" stroke="currentColor" strokeWidth="1.25" className="text-[#CBD5E1] dark:text-[#1E325C]" />
        <line x1="20" y1="14" x2="20" y2="88" stroke="currentColor" strokeWidth="1.25" className="text-[#CBD5E1] dark:text-[#1E325C]" />
        <line x1="20" y1="62" x2="268" y2="34" stroke="#64748B" strokeWidth="2" strokeDasharray="5 4" />
        <line x1="20" y1="88" x2="268" y2="16" stroke="#2F6BFF" strokeWidth="2.5" />
        <line x1="154" y1="47" x2="154" y2="88" stroke="#2F6BFF" strokeWidth="1.25" strokeDasharray="3 3" />
        <circle cx="154" cy="47" r="5.5" fill="#2F6BFF" stroke="#FFFFFF" strokeWidth="2" />

        <text x="234" y="16" textAnchor="middle" fontSize="12" fontWeight="600" fill="#2F6BFF">
          الإيرادات
        </text>
        <text x="242" y="55" textAnchor="middle" fontSize="12" fontWeight="500" className="fill-[#475569] dark:fill-[#CBD5E1]">
          التكاليف
        </text>
      </svg>
    </div>
  );
}

export function PythonCodePreview() {
  return (
    <div className="mt-5 overflow-hidden rounded-[12px] border border-[#1E325C] bg-[#070D1F] p-4 text-[#FAFBFC]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#1E325C] pb-2.5 text-xs">
        <span className="font-semibold text-[#CBD5E1]">
          تنفيذ فوري داخل المتصفح
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#22C55E]/15 px-2.5 py-0.5 font-semibold text-[#4ADE80]">
          <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
          <span>النتيجة: متوازن · +45 نقطة</span>
        </span>
      </div>

      <div
        dir="ltr"
        className="space-y-1.5 font-mono text-sm leading-relaxed text-[#E2E8F0]"
      >
        <div className="flex items-center gap-2 rounded-[6px] bg-[#2F6BFF]/15 px-2.5 py-1.5">
          <span className="text-[#60A5FA]">&gt;&gt;&gt;</span>
          <span>65000 == (15000 + 50000)</span>
          <span className="inline-block h-4 w-2 bg-[#2F6BFF] animate-code-pulse" />
        </div>
        <div dir="rtl" className="px-2.5 pt-1 text-right font-sans text-sm font-medium text-[#4ADE80]">
          المخرجات: القوائم متوازنة تماماً
        </div>
      </div>
    </div>
  );
}

/**
 * 4) Teachers Auto-Grading Visual Flow Illustration
 * Clean 3-node architectural SVG + responsive HTML summary bar below (prevents any text overlap on mobile).
 */
export function TeacherAutoGradingIllustration() {
  return (
    <div className="w-full space-y-4 rounded-[20px] border border-[#1E325C] bg-[#070D1F] p-4 sm:p-6">
      <svg
        viewBox="0 0 540 156"
        className="h-auto w-full"
        role="img"
        aria-label="رسم يوضح إرسال المعلم واجباً عملياً ثم حله في المختبر وتصحيحه تلقائياً"
      >
        {/* Connector Flow Lines (Right -> Center -> Left) */}
        <path
          d="M 380 78 L 328 78"
          fill="none"
          stroke="#2F6BFF"
          strokeWidth="2"
          className="animate-flow-dash"
        />
        <path
          d="M 192 78 L 146 78"
          fill="none"
          stroke="#22C55E"
          strokeWidth="2"
          className="animate-flow-dash"
        />

        {/* Node 1 (Right): Teacher Creates Assignment */}
        <g>
          <rect x="380" y="18" width="144" height="120" rx="14" fill="#0A1630" stroke="#2F6BFF" strokeWidth="1.5" />
          <rect x="396" y="34" width="112" height="24" rx="6" fill="rgba(47,107,255,0.2)" />
          <text x="452" y="50" textAnchor="middle" fontSize="12" fontWeight="700" fill="#93C5FD">
            1. تكليف من المعلم
          </text>
          <rect x="402" y="74" width="100" height="8" rx="4" fill="#1E325C" />
          <rect x="426" y="74" width="76" height="8" rx="4" fill="#2F6BFF" />
          <rect x="402" y="92" width="100" height="8" rx="4" fill="#1E325C" />
          <rect x="442" y="92" width="60" height="8" rx="4" fill="#60A5FA" />
          <text x="452" y="122" textAnchor="middle" fontSize="12" fontWeight="500" fill="#CBD5E1">
            تحديد مهمة عملية
          </text>
        </g>

        {/* Node 2 (Center): Student Solves Inside Lab */}
        <g>
          <rect x="192" y="18" width="136" height="120" rx="14" fill="#0A1630" stroke="#3B82F6" strokeWidth="1.5" />
          <rect x="206" y="34" width="108" height="24" rx="6" fill="rgba(47,107,255,0.2)" />
          <text x="260" y="50" textAnchor="middle" fontSize="12" fontWeight="700" fill="#93C5FD">
            2. الحل في المختبر
          </text>
          <rect x="214" y="72" width="38" height="32" rx="6" fill="#070D1F" stroke="#2F6BFF" strokeWidth="1.25" />
          <rect x="264" y="72" width="42" height="32" rx="6" fill="#070D1F" stroke="#2F6BFF" strokeWidth="1.25" />
          <line x1="224" y1="88" x2="242" y2="88" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
          <line x1="274" y1="88" x2="296" y2="88" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
          <text x="260" y="122" textAnchor="middle" fontSize="12" fontWeight="500" fill="#CBD5E1">
            تطبيق حي بالمحاكاة
          </text>
        </g>

        {/* Node 3 (Left): Instant Auto-Grading */}
        <g>
          <rect x="16" y="18" width="130" height="120" rx="14" fill="#0A1630" stroke="#22C55E" strokeWidth="1.75" />
          <rect x="28" y="34" width="106" height="24" rx="6" fill="rgba(34,197,94,0.18)" />
          <text x="81" y="50" textAnchor="middle" fontSize="12" fontWeight="700" fill="#4ADE80">
            3. تصحيح تلقائي
          </text>
          <circle cx="81" cy="86" r="17" fill="rgba(34,197,94,0.16)" stroke="#22C55E" strokeWidth="1.5" />
          <path
            d="M 73 86 L 79 92 L 90 80"
            fill="none"
            stroke="#4ADE80"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="81" y="122" textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFFFFF">
            الدرجة: 95 / 100
          </text>
        </g>
      </svg>

      {/* Clean Responsive Summary Bar (No SVG Overlap) */}
      <div className="flex flex-col justify-between gap-3 rounded-[14px] border border-[#1E325C] bg-[#0A1630] p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-base font-bold text-white">
            سجل درجات الشعبة يتحدث فورياً
          </p>
          <p className="mt-1 text-sm leading-[1.6] text-[#CBD5E1]">
            تظهر الدرجة والملاحظات ومستوى إتقان المهارة لكل طالب دون أي تصحيح يدوي.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center justify-center rounded-[10px] bg-[#2F6BFF] px-4 py-2 text-sm font-bold text-white">
          تقييم لحظي 100%
        </span>
      </div>
    </div>
  );
}
