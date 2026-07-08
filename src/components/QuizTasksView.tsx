import React, { useState } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  StopCircle, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Code2, 
  Plus,
  Users,
  Award,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import { ActiveQuiz, StudentQuizProgress, Resource } from '../types';

interface QuizTasksViewProps {
  quizzes: ActiveQuiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<ActiveQuiz[]>>;
  availableResources: Resource[];
}

export const QuizTasksView: React.FC<QuizTasksViewProps> = ({
  quizzes,
  setQuizzes,
  availableResources
}) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>(
    quizzes.length > 0 ? quizzes[0].id : ''
  );
  
  // Modal state for releasing a new quiz
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizClass, setNewQuizClass] = useState('高一（3）班');

  // Drawer / inspector state for student coding submission
  const [inspectingStudent, setInspectingStudent] = useState<StudentQuizProgress | null>(null);

  const activeQuiz = quizzes.find(q => q.id === selectedQuizId);

  // Quick state controls
  const handleToggleStatus = (quizId: string, currentStatus: 'active' | 'paused' | 'ended', nextStatus: 'active' | 'paused' | 'ended') => {
    setQuizzes(prev => prev.map(q => {
      if (q.id === quizId) {
        return {
          ...q,
          status: nextStatus
        };
      }
      return q;
    }));
  };

  // Release a new quiz
  const handleReleaseQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim()) return;

    // Create realistic mock students for the newly released quiz
    const students: StudentQuizProgress[] = [
      { id: 'ns-1', studentName: '陈逸飞', studentId: 'S2691', progress: 0, score: 0, status: 'online', submissions: [] },
      { id: 'ns-2', studentName: '蒋诗雨', studentId: 'S2692', progress: 0, score: 0, status: 'online', submissions: [] },
      { id: 'ns-3', studentName: '徐智博', studentId: 'S2693', progress: 0, score: 0, status: 'online', submissions: [] },
      { id: 'ns-4', studentName: '沈妙仪', studentId: 'S2694', progress: 0, score: 0, status: 'online', submissions: [] },
      { id: 'ns-5', studentName: '叶俊华', studentId: 'S2695', progress: 0, score: 0, status: 'offline', submissions: [] },
    ];

    const newQuiz: ActiveQuiz = {
      id: `quiz-${Date.now()}`,
      title: newQuizTitle,
      className: newQuizClass,
      studentCount: students.length,
      completedCount: 0,
      avgScore: 0,
      status: 'active',
      releasedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      students
    };

    setQuizzes(prev => [newQuiz, ...prev]);
    setSelectedQuizId(newQuiz.id);
    setNewQuizTitle('');
    setShowReleaseModal(false);
  };

  // Prepare chart data: individual student scores
  const chartData = activeQuiz
    ? activeQuiz.students.map(s => ({
        name: s.studentName,
        '当前得分': s.score,
        '完成进度': s.progress,
      }))
    : [];

  return (
    <div className="space-y-8 p-1">
      {/* Header controls toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Selector tabs for multiple quizzes */}
        <div className="flex space-x-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          {quizzes.map((quiz) => {
            const isSelected = quiz.id === selectedQuizId;
            let statusIndicator = 'bg-emerald-500';
            if (quiz.status === 'paused') statusIndicator = 'bg-amber-500';
            if (quiz.status === 'ended') statusIndicator = 'bg-slate-400';

            return (
              <button
                key={quiz.id}
                onClick={() => setSelectedQuizId(quiz.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate max-w-[200px] ${
                  isSelected 
                    ? 'bg-white border border-slate-200 text-slate-800 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusIndicator}`} />
                <span>{quiz.title}</span>
              </button>
            );
          })}
        </div>

        {/* Release New button */}
        <button
          onClick={() => setShowReleaseModal(true)}
          className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus size={14} />
          <span>发布随堂新测验</span>
        </button>
      </div>

      {activeQuiz ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Progress monitoring grid and submissions */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Monitor Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
              {/* Card Title & Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{activeQuiz.title}</h4>
                  <div className="flex space-x-3 text-xs text-slate-400 mt-1 font-mono font-medium">
                    <span>考查班级：{activeQuiz.className}</span>
                    <span>•</span>
                    <span>启动：{activeQuiz.releasedAt}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  {activeQuiz.status === 'active' ? (
                    <>
                      <button
                        onClick={() => handleToggleStatus(activeQuiz.id, 'active', 'paused')}
                        className="p-1.5 hover:bg-white text-amber-600 hover:text-amber-700 rounded-lg transition-colors cursor-pointer"
                        title="暂停测验"
                      >
                        <Pause size={12} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(activeQuiz.id, 'active', 'ended')}
                        className="p-1.5 hover:bg-white text-rose-600 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                        title="结束测验"
                      >
                        <StopCircle size={12} />
                      </button>
                    </>
                  ) : activeQuiz.status === 'paused' ? (
                    <>
                      <button
                        onClick={() => handleToggleStatus(activeQuiz.id, 'paused', 'active')}
                        className="p-1.5 hover:bg-white text-emerald-600 hover:text-emerald-700 rounded-lg transition-colors cursor-pointer"
                        title="恢复测验"
                      >
                        <Play size={12} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(activeQuiz.id, 'paused', 'ended')}
                        className="p-1.5 hover:bg-white text-rose-600 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                        title="结束测验"
                      >
                        <StopCircle size={12} />
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono px-3 py-1 font-bold">
                      测验已结束存档
                    </span>
                  )}
                </div>
              </div>

              {/* Grid display for individual students progress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeQuiz.students.map((student) => {
                  const lastSub = student.submissions[0];
                  let statusBadge = (
                    <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-400 px-2 py-0.5 rounded">
                      未提交
                    </span>
                  );

                  if (student.progress === 100) {
                    statusBadge = (
                      <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded flex items-center space-x-1 font-mono font-medium">
                        <CheckCircle size={10} />
                        <span>已完成 ({student.score}分)</span>
                      </span>
                    );
                  } else if (lastSub?.status === 'fail') {
                    statusBadge = (
                      <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-700 px-2 py-0.5 rounded flex items-center space-x-1 font-mono font-medium">
                        <XCircle size={10} />
                        <span>编译失败</span>
                      </span>
                    );
                  } else if (student.progress > 0) {
                    statusBadge = (
                      <span className="text-[10px] bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono font-medium animate-pulse">
                        进行中 ({student.progress}%)
                      </span>
                    );
                  }

                  return (
                    <div 
                      key={student.id}
                      className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/75 hover:border-slate-350 rounded-xl p-4 flex flex-col justify-between space-y-3.5 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-2 h-2 rounded-full ${
                            student.status === 'online' ? 'bg-emerald-500 animate-pulse' :
                            student.status === 'idle' ? 'bg-amber-500' : 'bg-slate-400'
                          }`} />
                          <div>
                            <p className="text-xs font-bold text-slate-800 leading-none">{student.studentName}</p>
                            <span className="text-[9px] text-slate-400 font-mono mt-1 block">学号: {student.studentId}</span>
                          </div>
                        </div>
                        {statusBadge}
                      </div>

                      {/* Small progress meter */}
                      <div className="space-y-1">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Submissions compiler links if any */}
                      {student.submissions.length > 0 && (
                        <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                          <span className="text-[10px] text-slate-450 flex items-center font-mono">
                            <Code2 size={11} className="mr-1 text-slate-400" />
                            {lastSub.language.toUpperCase()} 编译提交
                          </span>
                          <button
                            onClick={() => setInspectingStudent(student)}
                            className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center space-x-1"
                          >
                            <span>调阅代码</span>
                            <RefreshCw size={8} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recharts Analytics Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">随测成绩分布与进度对比</h4>
              <div className="h-64 w-full text-xs font-sans">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} />
                    <YAxis stroke="#94a3b8" tickLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#1e293b', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Bar dataKey="当前得分" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={28} />
                    <Bar dataKey="完成进度" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={28} opacity={0.5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Right Column: Quiz Summary Stats & Release Helper */}
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">测验总体成效诊断</h4>
              
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 flex items-center space-x-2">
                    <Users size={14} className="text-blue-500" />
                    <span>应考/实考人数</span>
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-800">
                    {activeQuiz.studentCount}人 / {activeQuiz.students.filter(s => s.progress > 0).length}人
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 flex items-center space-x-2">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span>已完整提交率</span>
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-600">
                    {activeQuiz.studentCount > 0 ? Math.round((activeQuiz.completedCount / activeQuiz.studentCount) * 100) : 0}%
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500 flex items-center space-x-2">
                    <Award size={14} className="text-amber-500" />
                    <span>当前班级平均分</span>
                  </span>
                  <span className="text-sm font-bold font-mono text-amber-600">{activeQuiz.avgScore} 分</span>
                </div>
              </div>

              {/* Status block warnings */}
              {activeQuiz.status === 'active' && (
                <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl flex items-start space-x-2.5 mt-2">
                  <AlertCircle size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    监考引擎运行中，客户端的键盘输入日志、沙箱编译流、提交频次已正常校准，无代写或多机操作警报。
                  </p>
                </div>
              )}
            </div>

            {/* AI Generated Question blueprint preview */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center space-x-2 text-indigo-655 text-indigo-700">
                <BookOpen size={16} />
                <h4 className="text-xs font-bold uppercase tracking-wider">关联教研题包大纲</h4>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2.5">
                <p className="text-xs font-bold text-slate-800 truncate">{activeQuiz.title}</p>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 block font-mono">包含题型对齐：</span>
                  <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                    1. 单选：基础算法边界判定 ($O(n)$ 与 $O(\log n)$ 对比)<br />
                    2. 填空：双指针偏移细节控制 (\`mid\` 防止整型溢出公式)<br />
                    3. 编程：数组搜索标准实现与异常边界返回 \`-1\`
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 shadow-sm">
          <p className="text-xs">请点击右上角发布随堂测验卷以启动监考看板。</p>
        </div>
      )}

      {/* MODAL: Release New Quiz */}
      {showReleaseModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800">发布随堂在线测验</h4>
              <button 
                onClick={() => setShowReleaseModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReleaseQuiz} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">选择测研试卷题包 (AI资源)</label>
                <select
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none"
                  required
                >
                  <option value="">-- 请选择关联资源 --</option>
                  {availableResources.filter(r => r.type === 'quiz').map((r) => (
                    <option key={r.id} value={r.title}>{r.title}</option>
                  ))}
                  <option value="算法核心与冒泡随堂测验">默认随考: 算法核心与冒泡随堂测验</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">发布目标班级</label>
                <select
                  value={newQuizClass}
                  onChange={(e) => setNewQuizClass(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="高一（3）班">高一（3）班 (计算机基础课)</option>
                  <option value="高一（1）班">高一（1）班 (人工智能基础)</option>
                  <option value="高二（4）班">高二（4）班 (选修数据结构)</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-100/60 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  发布后，该班级的学生客户端将同步弹出在线编码界面。AI 智能监考、沙箱自编译和异常提交比对将实时在云端铺开。
                </p>
              </div>

              <div className="flex justify-end space-x-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReleaseModal(false)}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer"
                >
                  确认即刻下发测验
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECTOR DRAWER: Inspect student code submission */}
      {inspectingStudent && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-end z-50">
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            className="bg-white border-l border-slate-200 max-w-2xl w-full h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">调阅 student 代码提交记录</h4>
                  <p className="text-xs text-slate-450 font-mono mt-0.5">
                    学生: {inspectingStudent.studentName} | 学号: {inspectingStudent.studentId}
                  </p>
                </div>
                <button 
                  onClick={() => setInspectingStudent(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                >
                  ✕ 关闭窗口
                </button>
              </div>

              {/* Submissions loop details */}
              <div className="space-y-5">
                {inspectingStudent.submissions.map((sub, idx) => {
                  const isPass = sub.status === 'pass';
                  return (
                    <div key={idx} className="space-y-3.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded font-mono">
                          问题 ID: {sub.problemId} • {sub.language.toUpperCase()}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-[11px] text-slate-400 font-mono">提交时间: {sub.timestamp}</span>
                          <span className={`text-[10px] px-2 py-0.5 border rounded font-mono font-semibold ${
                            isPass 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                              : 'bg-rose-50 border-rose-100 text-rose-700'
                          }`}>
                            {isPass ? '✓ PASS' : '✗ FAIL'}
                          </span>
                        </div>
                      </div>

                      {/* Code Block */}
                      <pre className="bg-slate-50 border border-slate-200 p-4 rounded-xl font-mono text-xs text-slate-800 overflow-x-auto leading-relaxed select-text">
                        <code>{sub.code}</code>
                      </pre>

                      {/* Error details if fail */}
                      {!isPass && sub.error && (
                        <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl">
                          <p className="text-xs text-rose-700 font-mono flex items-center space-x-2">
                            <XCircle size={14} />
                            <span>沙箱执行堆栈报错 (Compiler traceback)：</span>
                          </p>
                          <p className="text-xs text-slate-600 font-mono mt-1.5 whitespace-pre-wrap ml-5 bg-white p-2.5 rounded border border-slate-200/80">
                            {sub.error}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="border-t border-slate-100 pt-4 flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setInspectingStudent(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer"
              >
                已审阅，返回监考大屏
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
