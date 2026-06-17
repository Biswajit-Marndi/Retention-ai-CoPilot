import { BarChart3, Upload, History, Settings, HelpCircle, ShieldAlert } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: BarChart3, active: true },
  { name: 'Upload Data', icon: Upload, active: false },
  { name: 'History', icon: History, active: false },
];

const secondaryNav = [
  { name: 'Settings', icon: Settings },
  { name: 'Help', icon: HelpCircle },
];

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
          <ShieldAlert className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-semibold tracking-tight">Retention</span>
          <span className="text-lg font-light text-blue-400"> CoPilot</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                item.active
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </button>
          ))}
        </div>

        <div className="mt-auto space-y-1 border-t border-slate-700 pt-4">
          {secondaryNav.map((item) => (
            <button
              key={item.name}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </button>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 text-sm font-semibold text-slate-900">
            CS
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">CS Manager</p>
            <p className="truncate text-xs text-slate-400">cs@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
