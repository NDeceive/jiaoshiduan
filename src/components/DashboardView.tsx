import React from 'react';
import { 
  Users, 
  BookOpen, 
  Activity, 
  Percent, 
  ArrowUpRight, 
  Sparkles, 
  Play, 
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { Resource, ActiveQuiz, KnowledgeWeakness } from '../types';

interface DashboardViewProps {
  resources: Resource[];
  activeQuizzes: ActiveQuiz[];
  weaknesses: KnowledgeWeakness[];
  onNavigateToTab: (tab: string) => void;
  onSelectResourceForPreview: (res: Resource) => void;
  onPreFillGenerator: (topic: string, grade: string, type: 'curriculum' | 'coding_task' | 'quiz' | 'slides') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  resources,
  activeQuizzes,
  weaknesses,
  onNavigateToTab,
  onSelectResourceForPreview,
  onPreFillGenerator
}) => {
  // Compute metrics
  const totalStudents = 32; // representative class size
  const totalResources = resources.length;
  const liveQuizzes = activeQuizzes.filter(q => q.status === 'active');
  const avgScore = activeQuizzes.length > 0 
    ? (activeQuizzes.reduce((acc, q) => acc + q.avgScore, 0) / activeQuizzes.length).toFixed(1)
    : '0';

  const stats = [
    { label: '带教班级学生总数', value: totalStudents, change: '+4人较上周', icon: Users, color: 'text-blue-600 bg-blue-50 border border-blue-100' },
    { label: 'AI 生成教研资源数', value: totalResources, change: '100% 教师采纳', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 border border-indigo-100' },
    { label: '当前正在运行测验', value: liveQuizzes.length, change: '实时监控中', icon: Activity, color: 'text-emerald-600 bg-emerald-50 border border-emerald-100' },
    { label: '平均测验达标率', value: `${avgScore}%`, change: '+2.5% 本月提升', icon: Percent, color: 'text-amber-600 bg-amber-50 border border-amber-100' },
  ];

  return (
    <div className="space-y-8 p-1">
      {/* Welcome & Highlight action */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-blue-50/40 border border-blue-100/80 rounded-3xl p-8"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-xs font-semibold font-sans">
              <Sparkles size={12} />
              <span>多智能体协同已全面升级</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 font-sans leading-tight">
              欢迎回来，王博远老师。
            </h3>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              计智引擎已连接 4 大专属教研智能体组，当前运行状态良好。已为您同步生成最新的班级薄弱学情看板，今天需要给高一（3）班生成针对性的递归或排序强化题吗？
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('generator')}
            className="self-start md:self-center bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center space-x-2 shadow-sm transition-all cursor-pointer group shrink-0 text-sm"
          >
            <Sparkles size={16} className="text-blue-100 group-hover:rotate-12 transition-transform" />
            <span>进入 AI 资源生成</span>
            <ArrowUpRight size={14} className="text-blue-100" />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 tracking-wider">{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold font-sans text-slate-900">{stat.value}</span>
                <p className="text-[11px] text-slate-500 font-mono mt-1 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span>
                  {stat.change}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Dashboard Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Quizzes & Recent Resources */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Quiz Monitor widget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
                <h4 className="text-base font-bold text-slate-900">正在进行的课堂测验</h4>
              </div>
              <button 
                onClick={() => onNavigateToTab('quizzes')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center cursor-pointer"
              >
                <span>进入全屏监考</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {liveQuizzes.length === 0 ? (
              <div className="text-center py-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Clock size={32} className="mx-auto text-slate-400 mb-2" />
                <p className="text-xs text-slate-500">当前没有处于激活状态的随堂测验</p>
                <button 
                  onClick={() => onNavigateToTab('quizzes')}
                  className="mt-3 text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  去发布一个新测验
                </button>
              </div>
            ) : (
              liveQuizzes.map((quiz) => {
                const percent = Math.round((quiz.completedCount / quiz.studentCount) * 100);
                return (
                  <div key={quiz.id} className="bg-slate-50/30 border border-slate-200 rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold text-slate-900 text-sm">{quiz.title}</h5>
                        <div className="flex space-x-3 text-xs text-slate-400 mt-1 font-mono">
                          <span>班级：{quiz.className}</span>
                          <span>|</span>
                          <span>发布：{quiz.releasedAt.split(' ')[1]}</span>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-600 font-mono rounded">
                        已提交 {quiz.completedCount}/{quiz.studentCount}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-500">测验整体完成进度</span>
                        <span className="text-blue-600 font-semibold">{percent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className="bg-blue-600 h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>

                    {/* Compact real-time submissions ticker */}
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-[11px] text-slate-400 mb-2 flex items-center">
                        <RefreshCw size={10} className="animate-spin text-blue-500 mr-1.5" />
                        实时编译提交流 (实时更新)
                      </p>
                      <div className="grid grid-cols-5 gap-2.5">
                        {quiz.students.map((student) => {
                          const lastSub = student.submissions[0];
                          let statusColor = 'bg-slate-50 text-slate-400 border-slate-200/50';
                          if (student.progress === 100) statusColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                          else if (lastSub?.status === 'fail') statusColor = 'bg-rose-50 text-rose-600 border-rose-100';
                          else if (student.progress > 0) statusColor = 'bg-blue-50 text-blue-600 border-blue-100';

                          return (
                            <div 
                              key={student.id} 
                              className={`text-center py-2 px-1 rounded-lg border text-xs font-medium truncate ${statusColor}`}
                              title={`${student.studentName} - 进度: ${student.progress}%`}
                            >
                              {student.studentName}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Recent Resources list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-base font-bold text-slate-900">最近生成的教研资源</h4>
              <button 
                onClick={() => onNavigateToTab('generator')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center cursor-pointer"
              >
                <span>管理资源库</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {resources.slice(0, 3).map((res) => {
                const badgeStyle = {
                  curriculum: 'bg-indigo-50 border-indigo-100 text-indigo-600',
                  quiz: 'bg-emerald-50 border-emerald-100 text-emerald-600',
                  slides: 'bg-blue-50 border-blue-100 text-blue-600',
                  coding_task: 'bg-purple-50 border-purple-100 text-purple-600',
                }[res.type];

                const typeLabel = {
                  curriculum: '教学设计',
                  quiz: '随堂测验',
                  slides: '互动课件',
                  coding_task: '编程实战',
                }[res.type];

                return (
                  <div 
                    key={res.id}
                    onClick={() => onSelectResourceForPreview(res)}
                    className="flex items-center justify-between p-4 bg-slate-50/40 hover:bg-slate-50 border border-slate-150 hover:border-slate-200/80 rounded-xl transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <span className={`px-2 py-0.5 text-[11px] font-medium rounded border shrink-0 ${badgeStyle}`}>
                        {typeLabel}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                          {res.title}
                        </p>
                        <div className="flex space-x-3 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>核心知识：{res.topic}</span>
                          <span>•</span>
                          <span>生成日期：{res.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-400 group-hover:text-slate-600 ml-4">
                      {res.fineTuneCount && res.fineTuneCount > 0 ? (
                        <span className="text-[10px] font-mono bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-blue-600 shrink-0">
                          微调 x{res.fineTuneCount}
                        </span>
                      ) : null}
                      <ExternalLink size={14} className="shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Key Weakness Focus & Agent List */}
        <div className="space-y-8">
          
          {/* Top Leverage Remediation Focus */}
          <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 text-rose-600 mb-4">
              <AlertCircle size={16} />
              <h4 className="text-xs font-bold uppercase tracking-wider font-sans">优先学情警报</h4>
            </div>

            {weaknesses.length > 0 && (
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono">当前最核心薄弱板块：</span>
                  <h5 className="text-sm font-bold text-slate-900 mt-0.5">{weaknesses[0].topic}</h5>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-rose-50/20 border border-rose-100/60 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 block">全班平均掌握度</span>
                    <span className="text-base font-bold font-sans text-rose-600 mt-0.5 block">
                      {weaknesses[0].mastery}%
                    </span>
                  </div>
                  <div className="bg-rose-50/20 border border-rose-100/60 p-3 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 block">受影响学生范围</span>
                    <span className="text-base font-bold font-sans text-rose-600 mt-0.5 block">
                      {weaknesses[0].studentCount} 人
                    </span>
                  </div>
                </div>

                <div className="bg-rose-50/40 border border-rose-100/40 rounded-xl p-3.5">
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {weaknesses[0].recommendation}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onPreFillGenerator(weaknesses[0].topic, '高一', 'quiz');
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-blue-600 border border-slate-200 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer group transition-colors"
                >
                  <Sparkles size={12} className="group-hover:animate-bounce text-blue-500" />
                  <span>智能生成一键强化随测卷</span>
                </button>
              </div>
            )}
          </div>

          {/* AI Agents Group widget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI 教研智能体集群 (ACTIVE)</h4>
            
            <div className="space-y-3">
              {[
                { name: 'Curriculum Planning Agent', cn: '课程规划专家', desc: '考纲考点匹配与难度编排', status: 'online', code: '@curriculum_planner' },
                { name: 'Sandbox Executor Agent', cn: '代码架构专家', desc: '语法自编译与测试套件校验', status: 'online', code: '@sandbox_executor' },
                { name: 'Exercise Verifier Agent', cn: '教学评估专家', desc: '正确性检测与解析深度微调', status: 'online', code: '@quiz_verifier' },
                { name: 'Pedagogical Coach Agent', cn: '金牌助教专家', desc: '教学法设计与课堂导入大纲', status: 'online', code: '@pedagogy_coach' },
              ].map((agent, index) => (
                <div 
                  key={index} 
                  className="flex items-start justify-between p-3 rounded-xl bg-slate-50/40 border border-slate-200/50 hover:border-slate-200 transition-all cursor-pointer"
                  onClick={() => onNavigateToTab('logs')}
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                      <Award size={12} className="text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs font-semibold text-slate-800 truncate">{agent.cn}</h5>
                        <span className="text-[9px] text-slate-400 font-mono shrink-0">{agent.code}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{agent.desc}</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-emerald-600 font-mono font-medium shrink-0 flex items-center bg-emerald-50 px-1.5 py-0.5 border border-emerald-100 rounded ml-2">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1"></span>
                    ONLINE
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
