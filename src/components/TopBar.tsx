import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Search, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Settings,
  HelpCircle
} from 'lucide-react';

interface TopBarProps {
  activeTab: string;
}

export const TopBar: React.FC<TopBarProps> = ({ activeTab }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour12: false });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return { parent: '教研工作', current: '工作台首页' };
      case 'generator':
        return { parent: '教研工具', current: '多智能体资源生成' };
      case 'quizzes':
        return { parent: '教学监控', current: '随堂测验运行状态' };
      case 'analytics':
        return { parent: '学情看板', current: '班级学情诊断分析' };
      case 'logs':
        return { parent: '系统诊断', current: '协同智能体运行日志' };
      case 'import':
        return { parent: '教研工具', current: '题库智能导入' };
      default:
        return { parent: '教研工作', current: '工作台' };
    }
  };

  const { parent, current } = getBreadcrumb();

  return (
    <header className="h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-20 w-full text-slate-600">
      {/* Breadcrumbs */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
          <span>{parent}</span>
          <span>/</span>
          <span className="text-slate-500">{current}</span>
        </div>
        <h2 className="text-lg font-bold font-sans text-slate-950 mt-1">{current}</h2>
      </div>

      {/* Center Widget: Live Clock & API Status */}
      <div className="hidden lg:flex items-center space-x-6 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl">
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-mono">
          <Clock size={14} className="text-blue-600" />
          <span>{formatDate(time)}</span>
          <span className="text-slate-300">|</span>
          <span className="text-blue-600 font-bold">{formatTime(time)}</span>
        </div>

        <div className="w-px h-4 bg-slate-200" />

        <div className="flex items-center space-x-2">
          <div className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Cpu size={12} className="text-emerald-600" />
            AI 引擎联通中
          </span>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center space-x-4">
        {/* Help Widget */}
        <button className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-slate-800" title="使用帮助">
          <HelpCircle size={16} />
        </button>

        {/* System Settings Notification */}
        <button className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-slate-800 relative" title="消息中心">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
        </button>

        <div className="w-px h-6 bg-slate-200" />

        {/* Workspace Account Status */}
        <div className="flex items-center space-x-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
          <ShieldCheck size={14} className="text-blue-600" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600">教研管理员</span>
        </div>
      </div>
    </header>
  );
};
