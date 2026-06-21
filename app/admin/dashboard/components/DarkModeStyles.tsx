export default function DarkModeStyles() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      .dark-theme {
        --bg-main: #0b0f19; --bg-surface: #1e293b; --bg-hover: #334155;
        --border-color: #334155; --text-main: #f8fafc; --text-muted: #94a3b8; --text-active: #ffffff;
        background-color: var(--bg-main) !important; color: var(--text-main) !important;
      }
      .dark-theme aside { background-color: var(--bg-surface) !important; border-color: var(--border-color) !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5) !important; }
      .dark-theme aside a, .dark-theme aside button { color: var(--text-muted) !important; }
      .dark-theme aside a:hover, .dark-theme aside button:hover { background-color: var(--bg-hover) !important; color: var(--text-active) !important; }
      .dark-theme aside button[class*="text-primary"], .dark-theme aside button.text-primary { color: #ff7878 !important; background-color: rgba(255,0,0,0.15) !important; border-color: #ff0000 !important; }
      .dark-theme header { background-color: rgba(30,41,59,0.8) !important; border-color: var(--border-color) !important; }
      .dark-theme header input { background-color: var(--bg-main) !important; color: var(--text-main) !important; }
      .dark-theme header input::placeholder { color: var(--text-muted) !important; }
      .dark-theme main { background-color: var(--bg-main) !important; }
      .dark-theme .bg-white { background-color: var(--bg-surface) !important; border-color: var(--border-color) !important; color: var(--text-main) !important; }
      .dark-theme .border-slate-200, .dark-theme .border-slate-200\\/80, .dark-theme .border-slate-100, .dark-theme .border-slate-300 { border-color: var(--border-color) !important; }
      .dark-theme .bg-slate-100 { background-color: var(--bg-hover) !important; }
      .dark-theme .text-slate-500, .dark-theme .text-slate-600, .dark-theme .text-slate-400 { color: var(--text-muted) !important; }
      .dark-theme .text-slate-700, .dark-theme .text-slate-800, .dark-theme .text-slate-900 { color: var(--text-main) !important; }
      .dark-theme .text-on-surface { color: var(--text-main) !important; }
      .dark-theme .bg-red-50, .dark-theme .bg-red-100 { background-color: rgba(255,0,0,0.15) !important; }
      .dark-theme .bg-red-50\\/30 { background-color: rgba(255,0,0,0.08) !important; }
      .dark-theme .text-red-600, .dark-theme .text-red-700, .dark-theme .text-red-800 { color: #ff7878 !important; }
      .dark-theme .border-red-200, .dark-theme .border-red-100 { border-color: rgba(255,0,0,0.35) !important; }
      .dark-theme .bg-emerald-50, .dark-theme .bg-emerald-100 { background-color: rgba(16,185,129,0.15) !important; }
      .dark-theme .text-emerald-500, .dark-theme .text-emerald-600, .dark-theme .text-emerald-800 { color: #34d399 !important; }
      .dark-theme .border-emerald-200, .dark-theme .border-emerald-100 { border-color: rgba(16,185,129,0.35) !important; }
      .dark-theme .bg-orange-50, .dark-theme .bg-orange-100 { background-color: rgba(249,115,22,0.15) !important; }
      .dark-theme .text-orange-500, .dark-theme .text-orange-800 { color: #fb923c !important; }
      .dark-theme .border-orange-200 { border-color: rgba(249,115,22,0.35) !important; }
      .dark-theme .bg-slate-50 { background-color: #1e293b !important; color: var(--text-main) !important; }
      .dark-theme button.bg-slate-50:hover { background-color: #334155 !important; color: #ffffff !important; }
      .dark-theme .border-red-600 { border-color: #ef4444 !important; }
      .dark-theme .bg-blue-50, .dark-theme .bg-blue-100 { background-color: rgba(59,130,246,0.15) !important; }
      .dark-theme .text-blue-600, .dark-theme .text-blue-500 { color: #60a5fa !important; }
      .dark-theme .border-blue-100, .dark-theme .border-blue-200 { border-color: rgba(59,130,246,0.35) !important; }
      .dark-theme .bg-purple-50, .dark-theme .bg-purple-100 { background-color: rgba(168,85,247,0.15) !important; }
      .dark-theme .text-purple-600, .dark-theme .text-purple-500 { color: #c084fc !important; }
      .dark-theme .border-purple-100, .dark-theme .border-purple-200 { border-color: rgba(168,85,247,0.35) !important; }
      .dark-theme .bg-amber-50, .dark-theme .bg-amber-100 { background-color: rgba(245,158,11,0.15) !important; }
      .dark-theme .text-amber-600, .dark-theme .text-amber-700, .dark-theme .text-amber-800 { color: #fbbf24 !important; }
      .dark-theme .border-amber-100, .dark-theme .border-amber-200 { border-color: rgba(245,158,11,0.35) !important; }
      .dark-theme table thead tr { background-color: #111827 !important; border-color: var(--border-color) !important; }
      .dark-theme table tbody tr { border-color: var(--border-color) !important; }
      .dark-theme table tbody tr:hover { background-color: rgba(51,65,85,0.4) !important; }
      .dark-theme table th { color: var(--text-muted) !important; border-color: var(--border-color) !important; }
      .dark-theme table td { color: var(--text-main) !important; }
      .dark-theme .dark-theme-toggle { background-color: var(--bg-hover) !important; color: var(--text-main) !important; }
      .dark-theme .dark-theme-toggle:hover { background-color: #475569 !important; }
      .dark-theme .fixed .bg-white { background-color: var(--bg-surface) !important; border-color: var(--border-color) !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5) !important; }
      .dark-theme .fixed header { background-color: #111827 !important; border-color: var(--border-color) !important; }
      .dark-theme .fixed header button:hover { color: var(--text-active) !important; }
      .dark-theme input[type="file"]::file-selector-button { background-color: var(--bg-hover) !important; color: var(--text-main) !important; }
      .dark-theme .fixed form input, .dark-theme .fixed form textarea, .dark-theme .fixed form select { background-color: var(--bg-main) !important; border-color: var(--border-color) !important; color: var(--text-main) !important; }
      .dark-theme .fixed form input:focus, .dark-theme .fixed form textarea:focus, .dark-theme .fixed form select:focus { border-color: #ef4444 !important; box-shadow: 0 0 0 1px #ef4444 !important; }
      .dark-theme .fixed footer { border-color: var(--border-color) !important; }
      .dark-theme .fixed footer button:not([class*="bg-red"]) { border-color: var(--border-color) !important; color: var(--text-main) !important; }
      .dark-theme .fixed footer button:not([class*="bg-red"]):hover { background-color: var(--bg-hover) !important; }
      .dark-theme .bg-white:hover, .dark-theme .hover\\:bg-slate-50:hover { background-color: #27374d !important; }
      .dark-theme .material-symbols-outlined { color: inherit !important; }
      .dark-theme .text-slate-400 .material-symbols-outlined, .dark-theme span.material-symbols-outlined.text-slate-400 { color: #94a3b8 !important; }
      .dark-theme .border-slate-100.bg-white, .dark-theme .bg-white.border-slate-100 { background-color: #1e293b !important; border-color: #334155 !important; }
      .dark-theme img { border-color: transparent !important; }
      .dark-theme .rounded-xl.bg-slate-100 { background-color: #334155 !important; }
      .dark-theme .rounded-xl.bg-slate-100 .material-symbols-outlined { color: #94a3b8 !important; }
      .dark-theme .img-thumb-wrap { background-color: #1e293b !important; border-color: #334155 !important; }
      .dark-theme .guide-popup-card { background-color: #0f172a !important; border-color: rgba(255,0,0,0.4) !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7) !important; }
      .dark-theme .guide-popup-card .text-slate-800, .dark-theme .guide-popup-card .text-slate-700, .dark-theme .guide-popup-card .text-on-background { color: #f1f5f9 !important; }
      .dark-theme .guide-popup-card .text-slate-500, .dark-theme .guide-popup-card .text-slate-400 { color: #94a3b8 !important; }
      .dark-theme .guide-popup-card .border-slate-100 { border-color: #334155 !important; }
      .dark-theme .guide-popup-card .bg-slate-100 { background-color: #1e293b !important; border-color: #334155 !important; }
      .dark-theme .guide-popup-card .bg-slate-200 { background-color: #334155 !important; }
      .dark-theme .guide-popup-card .bg-white { background-color: #1e293b !important; }
      .dark-theme .guide-popup-card .bg-slate-50 { background-color: #172033 !important; }
      .dark-theme .guide-popup-card .border-slate-200, .dark-theme .guide-popup-card .border-slate-200\\/60, .dark-theme .guide-popup-card .border-slate-100 { border-color: #334155 !important; }
      .dark-theme .guide-popup-card .bg-red-50 { background-color: rgba(255,0,0,0.15) !important; }
      .dark-theme .text-on-background { color: var(--text-main) !important; }
    ` }} />
  );
}
