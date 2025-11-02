// components/student/TabNavigation.tsx

'use client';

type TabType = 'rewards' | 'history';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TABS = [
  { id: 'rewards' as TabType, label: '🎁 Ödüller', color: 'from-orange-500 to-red-500' },
  { id: 'history' as TabType, label: '📜 İşlem Geçmişi', color: 'from-blue-500 to-cyan-500' }
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-2">
      <div className="flex gap-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300
              ${activeTab === tab.id
                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

