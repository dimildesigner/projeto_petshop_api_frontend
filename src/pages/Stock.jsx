export default function Stock() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-stone-800 font-medium text-lg">Controle de estoque</h2>
        <p className="text-stone-400 text-sm">Entradas, saídas e alertas de reposição</p>
      </div>
      <div className="bg-white border border-stone-200 rounded-xl p-10 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-orange-400">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-stone-600 font-medium text-sm">Módulo em desenvolvimento</p>
        <p className="text-stone-400 text-xs mt-1">Em breve: entrada/saída de produtos, histórico e alertas visuais</p>
      </div>
    </div>
  );
}