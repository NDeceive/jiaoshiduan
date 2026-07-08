import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Timer, 
  BarChart3, 
  Terminal, 
  FileUp,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: '工作台', icon: LayoutDashboard, desc: '数据看板 & 快捷操作' },
    { id: 'generator', label: '资源生成', icon: Sparkles, desc: 'AI 多智能体教学创作' },
    { id: 'quizzes', label: '在线测验', icon: Timer, desc: '实时监控与编程提交' },
    { id: 'analytics', label: '班级学情', icon: BarChart3, desc: '掌握度网格 & 薄弱诊断' },
    { id: 'logs', label: '协同日志', icon: Terminal, desc: '智能体深度思考流' },
    { id: 'import', label: '题库导入', icon: FileUp, desc: 'Word/MD 文本智能解析' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-screen fixed left-0 top-0 text-slate-600 z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
          <Cpu size={22} />
        </div>
        <div>
          <h1 className="font-sans font-bold tracking-tight text-slate-900 text-base leading-none">计智引擎</h1>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-semibold mt-1 block">JiZhi ENGINE v1.2</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full text-left group relative flex items-center space-x-3.5 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer"
            >
              {/* Background active pill using motion */}
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-blue-50/70 border-l-2 border-blue-600 rounded-xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <Icon 
                size={18} 
                className={`relative z-10 transition-colors duration-200 ${
                  isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                }`} 
              />
              <div className="relative z-10 flex flex-col">
                <span className={`font-semibold text-xs transition-colors duration-200 ${
                  isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'
                }`}>
                  {item.label}
                </span>
                <span className={`text-[10px] transition-colors duration-200 ${
                  isActive ? 'text-blue-600/80' : 'text-slate-400 group-hover:text-slate-500'
                }`}>
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Teacher Profile / Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/40">
        <div className="flex items-center space-x-3 p-2 rounded-xl bg-white border border-slate-150">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
            <GraduationCap size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">王博远 老师</p>
            <p className="text-[10px] text-slate-400 truncate font-mono">计算机科学教研组</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 border-2 border-white shadow-sm" title="AI在线引擎已就绪" />
        </div>
      </div>
    </aside>
  );
};
