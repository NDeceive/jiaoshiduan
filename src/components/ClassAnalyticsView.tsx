import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  HelpCircle, 
  BookOpen, 
  ArrowUpRight, 
  Sparkles,
  CheckCircle,
  Users,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { KnowledgeWeakness } from '../types';

interface ClassAnalyticsViewProps {
  weaknesses: KnowledgeWeakness[];
  onPreFillGenerator: (topic: string, grade: string, type: 'curriculum' | 'coding_task' | 'quiz' | 'slides') => void;
}

export const ClassAnalyticsView: React.FC<ClassAnalyticsViewProps> = ({
  weaknesses,
  onPreFillGenerator
}) => {
  // Mastery history for overall class progress line chart
  const progressHistory = [
    { week: 'Wk 1', 'Python语法': 65, '算法思维': 40, '平均水平': 52.5 },
    { week: 'Wk 2', 'Python语法': 72, '算法思维': 48, '平均水平': 60.0 },
    { week: 'Wk 3', 'Python语法': 75, '算法思维': 52, '平均水平': 63.5 },
    { week: 'Wk 4', 'Python语法': 80, '算法思维': 58, '平均水平': 69.0 },
    { week: 'Wk 5', 'Python语法': 84, '算法思维': 64, '平均水平': 74.0 },
    { week: 'Wk 6', 'Python语法': 88, '算法思维': 69, '平均水平': 78.5 },
  ];

  // Radar chart data for student profiles (Core categories)
  const skillDistribution = [
    { subject: '递归调用', A: 45, fullMark: 100 },
    { subject: '双指针查找', A: 58, fullMark: 100 },
    { subject: '列表切片/内存', A: 65, fullMark: 100 },
    { subject: '大O复杂度分析', A: 72, fullMark: 100 },
    { subject: '循环与控制结构', A: 89, fullMark: 100 },
    { subject: '函数封装/规范', A: 92, fullMark: 100 },
  ];

  // Matrix grid of student masteries
  const studentMasteryMatrix = [
    { name: '张伟', recursion: 'A', binary: 'A', memory: 'A', bigo: 'B', basic: 'A' },
    { name: '李娜', recursion: 'B', binary: 'A', memory: 'B', bigo: 'A', basic: 'A' },
    { name: '王强', recursion: 'C', binary: 'B', memory: 'C', bigo: 'B', basic: 'A' },
    { name: '刘洋', recursion: 'B', binary: 'C', memory: 'B', bigo: 'C', basic: 'B' },
    { name: '赵敏', recursion: 'C', binary: 'C', memory: 'C', bigo: 'C', basic: 'B' },
  ];

  const getBadgeStyle = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'B': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'C': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      default: return 'bg-slate-950 border border-slate-800 text-slate-500';
    }
  };

  return (
    <div className="space-y-8 p-1">
      
      {/* Top layout: Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left AreaChart: Class Mastery Growth Curve */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">班级核心能力跃升曲线</h4>
            <p className="text-xs text-slate-500">跟踪过往 6 周在不同教研考核维度下的班级均分变化</p>
          </div>
          
          <div className="h-64 w-full text-xs font-sans mt-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAlgo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#64748b" tickLine={false} />
                <YAxis stroke="#64748b" tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="平均水平" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAvg)" />
                <Area type="monotone" dataKey="算法思维" stroke="#6366f1" strokeWidth={1.5} fillOpacity={1} fill="url(#colorAlgo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right RadarChart: Class skill radar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">各知识谱系均分分布 (Mastery Radar)</h4>
            <p className="text-xs text-slate-500">直观呈现在递归、排序、内存和复杂度四个核心版块的覆盖饱满度</p>
          </div>

          <div className="h-64 w-full text-xs font-sans mt-5 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillDistribution}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 8 }} />
                <Radar name="高一(3)班" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Layout: Weakness analysis & student matrix list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Weaknesses details - 7 Columns) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">班级知识薄弱点诊断与补救提议</h4>
          
          <div className="space-y-4.5">
            {weaknesses.map((weak, idx) => {
              let pctColor = 'text-rose-400';
              let barColor = 'bg-rose-500';
              if (weak.mastery > 60) {
                pctColor = 'text-blue-400';
                barColor = 'bg-blue-500';
              }

              return (
                <div 
                  key={idx}
                  className="bg-slate-950/40 hover:bg-slate-950/70 border border-slate-800/80 hover:border-slate-800 p-5 rounded-xl space-y-3.5 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors flex items-center space-x-1.5">
                        <AlertCircle size={14} className="text-rose-400 shrink-0" />
                        <span>{weak.topic}</span>
                      </h5>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">受影响范围：{weak.studentCount}名学生处于低段水位</span>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-bold font-mono ${pctColor}`}>{weak.mastery}%</span>
                      <span className="text-[9px] text-slate-500 block">掌握度</span>
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor}`} style={{ width: `${weak.mastery}%` }} />
                  </div>

                  {/* AI Recommendation text */}
                  <p className="text-xs text-slate-400 leading-relaxed font-sans bg-slate-900/50 p-3 rounded-lg border border-slate-800/60">
                    {weak.recommendation}
                  </p>

                  {/* Actions to prefill generator */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onPreFillGenerator(weak.topic, '高一', 'quiz')}
                      className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>一键定制强化练习</span>
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (Student Mastery Matrix - 5 Columns) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">学生个人维分布矩阵 (Mastery Matrix)</h4>
            <p className="text-xs text-slate-500">查阅班内典型学生在各项评估节点上的分档水位评价 (A/B/C)</p>

            <div className="border border-slate-800 rounded-xl overflow-hidden mt-4">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-500">
                  <tr>
                    <th className="p-3.5 font-bold">姓名</th>
                    <th className="p-3.5 font-bold text-center">递归</th>
                    <th className="p-3.5 font-bold text-center">双指针</th>
                    <th className="p-3.5 font-bold text-center">大O</th>
                    <th className="p-3.5 font-bold text-center">规范</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {studentMasteryMatrix.map((std, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/25 transition-colors">
                      <td className="p-3.5 font-sans font-bold text-slate-300">{std.name}</td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getBadgeStyle(std.recursion)}`}>
                          {std.recursion}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getBadgeStyle(std.binary)}`}>
                          {std.binary}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getBadgeStyle(std.bigo)}`}>
                          {std.bigo}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getBadgeStyle(std.basic)}`}>
                          {std.basic}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl mt-6">
            <span className="text-[11px] font-bold text-blue-400 flex items-center space-x-1.5 uppercase font-sans mb-1">
              <Sparkles size={12} />
              <span>智能学情推演建议</span>
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              根据当前评估，赵敏、王强两位同学在“递归调用边界”维度属于严重落后，下周排课时可利用“助教专家”一键下发针对性课后纠错卡进行异步跟进。
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
