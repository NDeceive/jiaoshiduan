import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Activity, 
  Layers, 
  BookOpen, 
  Code2, 
  AlertCircle, 
  CheckCircle,
  Clock,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentLog } from '../types';

interface AgentLogsViewProps {
  logs: AgentLog[];
}

export const AgentLogsView: React.FC<AgentLogsViewProps> = ({ logs }) => {
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Storing IDs of expanded detail log items
  const [expandedLogIds, setExpandedLogIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedLogIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter logs based on selection
  const filteredLogs = logs.filter((log) => {
    const matchesRole = roleFilter === 'all' || log.agentRole === roleFilter;
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    
    const matchesSearch = 
      log.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRole && matchesType && matchesSearch;
  });

  const getAgentColor = (role: string) => {
    switch (role) {
      case 'planner': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'executor': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'verifier': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'coach': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getSeverityStyle = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-400 bg-emerald-500/5 border-emerald-500/10';
      case 'warning': return 'text-amber-400 bg-amber-500/5 border-amber-500/10';
      case 'error': return 'text-rose-400 bg-rose-500/5 border-rose-500/10';
      default: return 'text-slate-400 bg-slate-950/50 border-slate-800';
    }
  };

  return (
    <div className="space-y-6 p-1">
      
      {/* Filtering Toolbar Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Search query input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="在多智能体协同运行日志中检索..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all font-sans"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-slate-950/40 p-1.5 rounded-xl border border-slate-800">
            <SlidersHorizontal size={13} className="text-slate-500 ml-1.5" />
            
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-400 font-semibold focus:outline-none pr-2"
            >
              <option value="all">所有智能体角色</option>
              <option value="planner">课程规划专家</option>
              <option value="executor">代码架构专家</option>
              <option value="verifier">教学评估专家</option>
              <option value="coach">金牌助教专家</option>
            </select>

            <span className="text-slate-800">|</span>

            {/* Severity Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-400 font-semibold focus:outline-none pr-2"
            >
              <option value="all">所有事件级别</option>
              <option value="info">常规事件 (Info)</option>
              <option value="success">编译/校验成功 (Success)</option>
              <option value="warning">重构微调 (Warning)</option>
              <option value="error">沙箱执行异常 (Error)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Content Area: Timeline Stream & System status summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Timeline (8 Columns) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h4 className="text-sm font-bold text-white">多智能体实时协同研讨链路</h4>
            <span className="text-[10px] text-slate-500 font-mono">
              共检索出 {filteredLogs.length} 条关联协作日志
            </span>
          </div>

          <div className="relative border-l border-slate-800 pl-6.5 ml-3 space-y-6">
            <AnimatePresence initial={false}>
              {filteredLogs.map((log) => {
                const isExpanded = !!expandedLogIds[log.id];
                const agentBadge = getAgentColor(log.agentRole);
                const severityStyle = getSeverityStyle(log.type);

                return (
                  <motion.div 
                    key={log.id}
                    layout="position"
                    className="relative group space-y-2.5"
                  >
                    {/* Node Dot icon anchor */}
                    <div className="absolute -left-[35px] top-1.5 p-1 bg-slate-900 border-2 border-slate-800 rounded-full group-hover:border-blue-500 transition-colors z-10 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>

                    {/* Timeline Item Card */}
                    <div className={`p-4 bg-slate-950/25 hover:bg-slate-950/55 rounded-xl border border-slate-800/80 transition-all cursor-pointer ${
                      isExpanded ? 'border-slate-700 bg-slate-950/50' : ''
                    }`}>
                      <div 
                        onClick={() => toggleExpand(log.id)}
                        className="flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] text-slate-500 font-mono font-semibold">{log.timestamp}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${agentBadge}`}>
                              {log.agentName}
                            </span>
                            <span className={`text-[9px] uppercase tracking-wider font-mono px-1.5 py-0.2 rounded border ${severityStyle}`}>
                              {log.type}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 font-semibold select-text leading-relaxed">
                            {log.message}
                          </p>
                        </div>

                        <div className="text-slate-500 group-hover:text-slate-300 shrink-0 self-center">
                          {log.details ? (
                            isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          ) : null}
                        </div>
                      </div>

                      {/* Expandable detailed compiler report or reasoning trees */}
                      {isExpanded && log.details && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-slate-800/80 mt-3 pt-3 space-y-3.5 select-text"
                        >
                          <div className="text-xs text-slate-400 font-sans leading-relaxed whitespace-pre-wrap font-mono">
                            {log.details}
                          </div>

                          {/* Tokens/Latency micro stats */}
                          <div className="flex items-center space-x-4 border-t border-slate-800/50 pt-2.5 text-[10px] text-slate-500 font-mono">
                            <span>底层模型: <span className="text-blue-400">gemini-3.5-flash</span></span>
                            <span>•</span>
                            <span>编译响应延迟: <span className="text-blue-400">{log.durationMs || 150}ms</span></span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Info panels (4 Columns) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Agent system structure topology summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-blue-400">
              <Terminal size={16} />
              <h4 className="text-xs font-bold uppercase tracking-wider">智能协同拓扑架构</h4>
            </div>

            <div className="space-y-4.5 pt-2">
              <div className="flex items-start space-x-3 text-xs">
                <span className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg font-bold font-mono">01</span>
                <div>
                  <p className="font-semibold text-white">策划编排 (Planning Stage)</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">规划专家根据教师配置出卷，规划大纲与各题型占比。</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <span className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg font-bold font-mono">02</span>
                <div>
                  <p className="font-semibold text-white">沙箱自编译 (Execution Stage)</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">架构专家接收代码并部署在虚拟 Python/C++ 运行环境进行编译自查。</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <span className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-bold font-mono">03</span>
                <div>
                  <p className="font-semibold text-white">多维校验 (Verification Stage)</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">评估专家匹配题干描述，核实错误选项边界及标准代码，打分比对。</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <span className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg font-bold font-mono">04</span>
                <div>
                  <p className="font-semibold text-white">金牌助教装配 (Pedagogy Stage)</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">助教专家组装课程大纲与多维答问微课，生成教师上课提问指引。</p>
                </div>
              </div>
            </div>
          </div>

          {/* Database stats and system variables logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Database size={16} />
              <h4 className="text-xs font-bold uppercase tracking-wider">分布式教研运行数据</h4>
            </div>

            <div className="space-y-3 pt-2 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">存储引擎 (Storage):</span>
                <span className="text-slate-300">Firestore (Persistent)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">主模型 (AI Model):</span>
                <span className="text-blue-400 font-bold">Gemini 3.5 Flash</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">沙箱语言环境 (Sandbox):</span>
                <span className="text-slate-300">Python 3.11.2 / gcc 11</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">实时编译成功率 (Success rate):</span>
                <span className="text-emerald-400 font-bold">100.0%</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
