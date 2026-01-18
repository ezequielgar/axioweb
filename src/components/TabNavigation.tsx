interface TabNavigationProps {
    activeTab: 'obleas' | 'reimpresiones';
    onTabChange: (tab: 'obleas' | 'reimpresiones') => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="flex border-b border-slate-700 mb-6">
            <button
                onClick={() => onTabChange('obleas')}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${activeTab === 'obleas'
                        ? 'text-white border-blue-500'
                        : 'text-slate-400 border-transparent hover:text-slate-300'
                    }`}
            >
                Mis Solicitudes
            </button>
            <button
                onClick={() => onTabChange('reimpresiones')}
                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${activeTab === 'reimpresiones'
                        ? 'text-white border-blue-500'
                        : 'text-slate-400 border-transparent hover:text-slate-300'
                    }`}
            >
                Solicitudes de Reimpresión
            </button>
        </div>
    );
}
